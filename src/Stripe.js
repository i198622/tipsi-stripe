import { NativeEventEmitter, NativeModules, Platform } from 'react-native'
import processTheme from './utils/processTheme'
import checkArgs from './utils/checkArgs'
import checkInit from './utils/checkInit'
import * as types from './utils/types'
import errorCodes from './errorCodes'
import EventEmitter from 'react-native/Libraries/vendor/emitter/EventEmitter'

const { StripeModule } = NativeModules
const stripeEventEmitter = new NativeEventEmitter(TPSStripeManager);

class Stripe extends EventEmitter {
  constructor() {
    super();

    let eventEmitter = this;
    this.clearEventListeners();

    this.onShippingMethodChanged = stripeEventEmitter.addListener(
      'onShippingMethodChanged',
      (method) => { eventEmitter.emit('onShippingMethodChanged', method) }
    )
    this.onShippingContactChanged = stripeEventEmitter.addListener(
      'onShippingContactChanged',
      (contact) => { eventEmitter.emit('onShippingContactChanged', contact) }
    )
  }
  stripeInitialized = false

  setOptions = (options = {}) => {
    checkArgs(
      types.setOptionsOptionsPropTypes,
      options, 'options', 'Stripe.setOptions'
    )

    this.stripeInitialized = true

    return StripeModule.init(options, errorCodes)
  }

  // @deprecated use deviceSupportsNativePay
  deviceSupportsAndroidPay = () => (
    StripeModule.deviceSupportsAndroidPay()
  )

  // @deprecated use deviceSupportsNativePay
  deviceSupportsApplePay = () => (
    StripeModule.deviceSupportsApplePay()
  )

  deviceSupportsNativePay = () => (
    Platform.select({
      ios: () => this.deviceSupportsApplePay(),
      android: () => this.deviceSupportsAndroidPay(),
    })()
  )

  // @deprecated use canMakeNativePayPayments
  canMakeApplePayPayments = (options = {}) => {
    checkArgs(
      types.canMakeApplePayPaymentsOptionsPropTypes,
      options, 'options', 'Stripe.canMakeApplePayPayments'
    )
    return StripeModule.canMakeApplePayPayments(options)
  }

  // @deprecated use canMakeNativePayPayments
  canMakeAndroidPayPayments = () => (
    StripeModule.canMakeAndroidPayPayments()
  )

  // iOS requires networks array while Android requires nothing
  canMakeNativePayPayments = (options = {}) => (
    Platform.select({
      ios: () => this.canMakeApplePayPayments(options),
      android: () => this.canMakeAndroidPayPayments(),
    })()
  )

  // @deprecated use paymentRequestWithNativePay
  paymentRequestWithAndroidPay = (options = {}) => {
    checkInit(this)
    checkArgs(
      types.paymentRequestWithAndroidPayOptionsPropTypes,
      options, 'options', 'Stripe.paymentRequestWithAndroidPay'
    )
    return StripeModule.paymentRequestWithAndroidPay(options)
  }

  // @deprecated use paymentRequestWithNativePay
  paymentRequestWithApplePay = (items = [], options = {}) => {
    checkInit(this)
    checkArgs(
      types.paymentRequestWithApplePayItemsPropTypes,
      { items }, 'items', 'Stripe.paymentRequestWithApplePay'
    )
    checkArgs(
      types.paymentRequestWithApplePayOptionsPropTypes,
      options, 'options', 'Stripe.paymentRequestWithApplePay'
    )
    return StripeModule.paymentRequestWithApplePay(items, options)
  }

  paymentRequestWithNativePay(options = {}, items = []) {
    return Platform.select({
      ios: () => this.paymentRequestWithApplePay(items, options),
      android: () => this.paymentRequestWithAndroidPay(options),
    })()
  }

  // @deprecated use completeNativePayRequest
  completeApplePayRequest = () => {
    checkInit(this);
    this.clearEventListeners();
    return StripeModule.completeApplePayRequest()
  }

  // no corresponding android impl exists
  completeNativePayRequest = () => (
    Platform.select({
      ios: () => this.completeApplePayRequest(),
      android: () => Promise.resolve(),
    })()
  )

  // @deprecated use cancelNativePayRequest
  cancelApplePayRequest = () => {
    checkInit(this)
    this.clearEventListeners();
    return StripeModule.cancelApplePayRequest()
  }

  // no corresponding android impl exists
  cancelNativePayRequest = () => (
    Platform.select({
      ios: () => this.cancelApplePayRequest(),
      android: () => Promise.resolve(),
    })()
  )

  // @deprecated use openNativePaySetup
  openApplePaySetup = () => (
    StripeModule.openApplePaySetup()
  )

  // no corresponding android impl exists
  openNativePaySetup = () => (
    Platform.select({
      ios: () => this.openApplePaySetup(),
      android: () => Promise.resolve(),
    })()
  )

  paymentRequestWithCardForm = (options = {}) => {
    checkInit(this)
    checkArgs(
      types.paymentRequestWithCardFormOptionsPropTypes,
      options, 'options', 'Stripe.paymentRequestWithCardForm'
    )
    return StripeModule.paymentRequestWithCardForm({
      ...options,
      theme: processTheme(options.theme),
    })
  }

  createTokenWithCard = (params = {}) => {
    checkInit(this)
    checkArgs(
      types.createTokenWithCardParamsPropTypes,
      params, 'params', 'Stripe.createTokenWithCard'
    )
    return StripeModule.createTokenWithCard(params)
  }

  createTokenWithBankAccount = (params = {}) => {
    checkInit(this)
    checkArgs(
      types.createTokenWithBankAccountParamsPropTypes,
      params, 'params', 'Stripe.createTokenWithBankAccount'
    )
    return StripeModule.createTokenWithBankAccount(params)
  }

  createSourceWithParams = (params = {}) => {
    checkInit(this)
    checkArgs(
      types.createSourceWithParamsPropType,
      params, 'params', 'Stripe.createSourceWithParams'
    )
    return StripeModule.createSourceWithParams(params)
  }

  updateSummaryItemsAndShippingMethods = ( items = [], methods = [], errors = [], callback = () => {}) => {
    checkInit(this)
    checkArgs(
      types.updateSummaryItemsPropTypes,
      items, 'items', 'Stripe.updateSummaryItemsAndShippingMethods'
    )
    checkArgs(
      types.updateShippingMethodsPropTypes,
      methods, 'methods', 'Stripe.updateSummaryItemsAndShippingMethods'
    )
    return TPSStripeManager.updateSummaryItems(items, methods, errors, callback)
  }

  clearEventListeners = () => {
    if (this.onShippingContactChanged) {
      this.onShippingContactChanged.remove();
      this.onShippingContactChanged = null;
    }
    if (this.onShippingMethodChanged) {
      this.onShippingMethodChanged.remove();
      this.onShippingMethodChanged = null;
    }
  }
}

export default new Stripe()
