#import "RnSmsOtpAutofill.h"

@implementation RnSmsOtpAutofill
RCT_EXPORT_MODULE()

// iOS não precisa implementar funcionalidades SMS pois usa autofill nativo
- (void)requestOtpAutofill {
    // Método vazio - iOS usa autofill nativo
}

- (void)stopOtpAutofill {
    // Método vazio - iOS usa autofill nativo
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeRnSmsOtpAutofillSpecJSI>(params);
}

@end
