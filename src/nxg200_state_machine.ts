// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import * as StateMachine from 'javascript-state-machine';

/* eslint-disable */
export const FSM = StateMachine.factory({
  init: 'closed',

  transitions: [
    { name: 'open',  from: ['stuck',   'closed'], to: 'open'   },
    { name: 'close', from: ['stuck',   'open'],   to: 'closed' },

    { name: 'stuck',        from: '*', to: 'stuck' },
    { name: 'resetOpen',    from: '*', to: 'open'  },
    { name: 'resetClosed',  from: '*', to: 'closed'},
  ],
  data: {
    deviceId: null,
    lastTransition: Date.now(),
    log: null,
    nexxApiClient: null,
    platformUUID: null,
    transitioning: false,
  },
  methods: {
    onBeforeOpen: async function() {
      this.lastTransition = Date.now();
      await this.nexxApiClient.open(this.deviceId, {AppVersion: '3.8.2', MobileDeviceUUID: this.platformUUID});
    },
    onBeforeClose: async function() {
      this.lastTransition = Date.now();
      await this.nexxApiClient.close(this.deviceId, {AppVersion: '3.8.2', MobileDeviceUUID: this.platformUUID});
    },
    isTransitioning: function(): boolean {
      return (Date.now() - 12_000) <= this.lastTransition;
    },
    toString: function() {
      return JSON.stringify({
        deviceId: this.deviceId, state: this.state, lastTransition: new Date(this.lastTransition),
        isTransitioning: this.isTransitioning()
      });
    }
  }
});
/* eslint-enable */
