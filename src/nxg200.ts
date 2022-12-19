import {Service, PlatformAccessory, CharacteristicValue} from 'homebridge';

import { NexxHomebridgePlatform } from './platform';

enum GarageDoorState {
  Open = 1,
  Closed = 2,
}

export class NXG200 {
  private readonly deviceId: string;
  private readonly service: Service;

  private DEFAULT_OPEN_TIME = 30_000; // 30 seconds

  private state = {
    currentStatus: GarageDoorState.Closed,
    targetStatus: GarageDoorState.Closed,
    isTransitioning: false,
    isBlocked: false,
    statusCause: 'Default',
    statusTime: new Date(Date.now()),
  };

  constructor(
    private readonly platform: NexxHomebridgePlatform,
    private readonly accessory: PlatformAccessory,
  ) {
    this.deviceId = accessory.context.device.DeviceId;
    this.state.currentStatus = accessory.context.device.DeviceStatus;
    this.state.targetStatus = accessory.context.device.DeviceStatus;
    this.state.statusCause = accessory.context.device.DeviceStatusName;
    this.state.statusTime = new Date(accessory.context.device.LastOperationTimestamp);

    // create a new Garage Door Opener service
    this.service = this.accessory.getService(this.platform.Service.GarageDoorOpener) ||
      this.accessory.addService(this.platform.Service.GarageDoorOpener);

    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Nexx')
      .setCharacteristic(this.platform.Characteristic.Model, accessory.context.device.ProductCode)
      .setCharacteristic(this.platform.Characteristic.SerialNumber, accessory.context.device.DeviceId);

    this.service.setCharacteristic(this.platform.Characteristic.Name, accessory.context.device.DeviceNickName);

    // create handlers for required characteristics
    this.service.getCharacteristic(this.platform.Characteristic.CurrentDoorState)
      .onGet(this.getCurrentDoorState.bind(this));

    this.service.getCharacteristic(this.platform.Characteristic.TargetDoorState)
      .onGet(this.getTargetDoorState.bind(this))
      .onSet(this.setTargetDoorState.bind(this));

    this.service.getCharacteristic(this.platform.Characteristic.ObstructionDetected)
      .onGet(this.getObstructionDetected.bind(this));

    setInterval(async () => {
      this.platform.log.debug(`Checking on the status of ${this.deviceId}`);
      if (this.state.isTransitioning) {
        this.platform.log.debug(`${this.deviceId} is transitioning to ${this.state.targetStatus}`);
      } else {
        const { Result: device } = await this.platform.nexxApiClient.getDeviceState(this.deviceId);
        this.platform.log.debug(`${this.deviceId} reported ${device.DeviceStatus}; we see state ${JSON.stringify(this.state)}`);
        if (this.state.currentStatus !== device.DeviceStatus) {
          this.platform.log.info('State change detected outside of HomeKit:', JSON.stringify(device));
          this.state.currentStatus = device.DeviceStatus;
        }
      }
    }, 60_000);
  }

  /**
   * Handle "SET" requests from HomeKit
   */
  async setTargetDoorState(value: CharacteristicValue) {
    if (this.state.isTransitioning) {
      this.platform.log.debug(`Trying to set ${value} but already transitioning to ${this.state.targetStatus}`);
      return;
    }
    this.platform.log.debug('Set Target Door State -> ', value);
    this.state.isTransitioning = true;
    if (value === this.platform.Characteristic.TargetDoorState.OPEN) {
      this.state.targetStatus = GarageDoorState.Open;
      await this.platform.nexxApiClient.open(this.deviceId, {AppVersion: '3.8.2', MobileDeviceUUID: this.accessory.UUID});
    } else {
      this.state.targetStatus = GarageDoorState.Closed;
      await this.platform.nexxApiClient.close(this.deviceId, {AppVersion: '3.8.2', MobileDeviceUUID: this.accessory.UUID});
    }

    setTimeout(async () => {
      const device = await this.platform.nexxApiClient.getDeviceState(this.deviceId);

      this.platform.log.debug('Door State finished ', value, this.deviceStatusMatchesState(device.DeviceStatus, value));

      if (this.deviceStatusMatchesState(device.DeviceStatus, value)) {
        this.state.currentStatus = this.state.targetStatus;

        this.state.isBlocked = false;
      } else {
        this.state.isBlocked = true;
      }

      this.state.isTransitioning = false;
    }, this.DEFAULT_OPEN_TIME);
  }

  async getTargetDoorState(): Promise<CharacteristicValue> {
    this.platform.log.debug('Get Target Door State -> ', this.state.targetStatus);

    return this.state.targetStatus === GarageDoorState.Open
      ? this.platform.Characteristic.TargetDoorState.OPEN
      : this.platform.Characteristic.TargetDoorState.CLOSED;
  }

  async getCurrentDoorState(): Promise<CharacteristicValue> {
    this.platform.log.debug('Get Current Door State -> ', this.state.currentStatus);

    if (this.state.currentStatus === this.state.targetStatus) {
      return this.state.targetStatus === GarageDoorState.Open
        ? this.platform.Characteristic.CurrentDoorState.OPEN
        : this.platform.Characteristic.CurrentDoorState.CLOSED;
    } else if (!this.state.isBlocked) {
      return this.state.targetStatus === GarageDoorState.Open
        ? this.platform.Characteristic.CurrentDoorState.OPENING
        : this.platform.Characteristic.CurrentDoorState.CLOSING;
    } else {
      return this.platform.Characteristic.CurrentDoorState.STOPPED;
    }
  }

  async getObstructionDetected(): Promise<CharacteristicValue> {
    this.platform.log.debug('Get Obstruction Detected -> ', this.state.isBlocked);

    return this.state.isBlocked;
  }

  private deviceStatusMatchesState(deviceState: GarageDoorState, homekitState: CharacteristicValue): boolean {
    const homekitIsOpen = homekitState === this.platform.Characteristic.TargetDoorState.OPEN ||
      homekitState === this.platform.Characteristic.CurrentDoorState.OPEN;
    return (deviceState !== GarageDoorState.Open) === !homekitIsOpen;
  }
}
