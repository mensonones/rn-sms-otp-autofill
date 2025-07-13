#import "RnSmsOtpAutofill.h"

@implementation RnSmsOtpAutofill
RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(requestOtpAutofill)
{
    // iOS não precisa implementar funcionalidades SMS pois usa autofill nativo
}

RCT_EXPORT_METHOD(stopOtpAutofill)
{
    // iOS não precisa implementar funcionalidades SMS pois usa autofill nativo
}

@end
