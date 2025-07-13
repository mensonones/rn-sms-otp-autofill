package com.rnsmsotpautofill

import android.content.IntentFilter
import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Arguments
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.bridge.ReactMethod

@ReactModule(name = RnSmsOtpAutofillModule.NAME)
class RnSmsOtpAutofillModule(reactContext: ReactApplicationContext) :
  NativeRnSmsOtpAutofillSpec(reactContext) {

  private fun sendOtpToJs(otp: String) {
    val params: WritableMap = Arguments.createMap()
    params.putString("otp", otp)
    reactApplicationContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit("onOtpAutofill", params)
  }

  private fun sendErrorToJs(error: String) {
    val params: WritableMap = Arguments.createMap()
    params.putString("error", error)
    reactApplicationContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit("onOtpAutofillError", params)
  }

  private var smsReceiver: SmsBroadcastReceiver? = null

  private fun hasSmsPermission(): Boolean {
    val permission = android.Manifest.permission.RECEIVE_SMS
    val granted = reactApplicationContext.checkCallingOrSelfPermission(permission) == android.content.pm.PackageManager.PERMISSION_GRANTED
    return granted
  }

  /**
   * Requests the native module to attempt OTP autofill
   */
  override fun requestOtpAutofill() {
    if (!hasSmsPermission()) {
      sendErrorToJs("SMS permission not granted.")
      return
    }
    if (smsReceiver != null) {
      // If it already exists, unregister to avoid leaks/duplicates
      reactApplicationContext.unregisterReceiver(smsReceiver)
      smsReceiver = null
    }
    smsReceiver = SmsBroadcastReceiver { otp ->
      // Extra validation: only accept 4-6 digit OTP and ignore duplicates
      if (otp.length in 4..6 && otp.all { it.isDigit() }) {
        Log.d(NAME, "Autofill OTP: $otp")
        sendOtpToJs(otp)
      } else {
        sendErrorToJs("Invalid OTP format: $otp")
      }
    }
    val filter = IntentFilter("android.provider.Telephony.SMS_RECEIVED")
    reactApplicationContext.registerReceiver(smsReceiver, filter)
  }

  /**
   * Stops the SMS listener and cleans up resources
   */
  override fun stopOtpAutofill() {
    smsReceiver?.let {
      reactApplicationContext.unregisterReceiver(it)
      smsReceiver = null
    }
  }

  override fun onCatalystInstanceDestroy() {
    stopOtpAutofill()
    super.onCatalystInstanceDestroy()
  }

  companion object {
    const val NAME = "RnSmsOtpAutofill"
  }
}
