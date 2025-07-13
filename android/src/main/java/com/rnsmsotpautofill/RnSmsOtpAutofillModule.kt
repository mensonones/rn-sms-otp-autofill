package com.rnsmsotpautofill

import android.content.IntentFilter
import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Arguments
import com.facebook.react.modules.core.DeviceEventManagerModule

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

  override fun getName(): String {
    return NAME
  }

  /**
   * Solicita ao nativo que tente autofill do OTP
   */
  override fun requestOtpAutofill() {
    if (!hasSmsPermission()) {
      sendErrorToJs("Permissão de SMS não concedida.")
      return
    }
    if (smsReceiver != null) {
      // Se já existe, desregistra para evitar leaks/duplicidade
      reactApplicationContext.unregisterReceiver(smsReceiver)
      smsReceiver = null
    }
    smsReceiver = SmsBroadcastReceiver { otp ->
      // Validação extra: só aceita OTP de 4-6 dígitos e ignora duplicidade
      if (otp.length in 4..6 && otp.all { it.isDigit() }) {
        Log.d(NAME, "Autofill OTP: $otp")
        sendOtpToJs(otp)
      } else {
        sendErrorToJs("Formato de OTP inválido: $otp")
      }
    }
    val filter = IntentFilter("android.provider.Telephony.SMS_RECEIVED")
    reactApplicationContext.registerReceiver(smsReceiver, filter)
  }

  /**
   * Para o listener de SMS e limpa recursos
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
