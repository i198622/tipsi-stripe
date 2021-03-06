//
//  TPSStripeManager.h
//  TPSStripe
//
//  Created by Anton Petrov on 28.10.16.
//  Copyright © 2016 Tipsi. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <PassKit/PassKit.h>
#import <Stripe/Stripe.h>
#import <React/RCTEventEmitter.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTConvert.h>

@interface StripeModule : NSObject <RCTBridgeModule, PKPaymentAuthorizationViewControllerDelegate, STPAddCardViewControllerDelegate>

@property (nonatomic) STPRedirectContext *redirectContext;

API_AVAILABLE(ios(11.0))
@interface TPSStripeManager : RCTEventEmitter <RCTBridgeModule, PKPaymentAuthorizationViewControllerDelegate, STPAddCardViewControllerDelegate>

@property (nonatomic, copy) void (^ _Nullable shippingContactCompletion)(PKPaymentRequestShippingContactUpdate * _Nonnull);
@property (nonatomic, copy) void (^ _Nullable shippingMethodCompletion)(PKPaymentRequestShippingMethodUpdate * _Nonnull);

@end
