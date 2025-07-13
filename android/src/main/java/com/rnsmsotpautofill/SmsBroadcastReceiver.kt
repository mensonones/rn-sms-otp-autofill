package com.rnsmsotpautofill

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.telephony.SmsMessage
import android.util.Log

class SmsBroadcastReceiver(private val onOtpReceived: (String) -> Unit) : BroadcastReceiver() {
    override fun onReceive(context: Context?, intent: Intent?) {
        if (intent?.action == "android.provider.Telephony.SMS_RECEIVED") {
            val bundle: Bundle? = intent.extras
            try {
                if (bundle != null) {
                    val pdus = bundle.get("pdus") as? Array<*>
                    pdus?.forEach { pdu ->
                        val format = bundle.getString("format")
                        val sms = SmsMessage.createFromPdu(pdu as ByteArray, format)
                        val messageBody = sms.messageBody
                        val otp = extractOtp(messageBody)
                        if (otp != null) {
                            Log.d("SmsBroadcastReceiver", "OTP recebido: $otp")
                            onOtpReceived(otp)
                        }
                    }
                }
            } catch (e: Exception) {
                Log.e("SmsBroadcastReceiver", "Erro ao ler SMS", e)
            }
        }
    }

    private fun extractOtp(message: String): String? {
        // Regex para encontrar um código de 4-6 dígitos
        val regex = Regex("\\b\\d{4,6}\\b")
        return regex.find(message)?.value
    }
}
