// SMS Service (Mock)
// In a real application, you would use a provider like Twilio, Vonage, or a local Saudi SMS provider.

import toast from 'react-hot-toast'

interface SMSOptions {
  to: string
  message: string
}

export async function sendSMS({ to, message }: SMSOptions): Promise<boolean> {
  console.log(`[SMS Service] Sending message to ${to}: ${message}`)
  
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Simulate success
  const success = true

  if (success) {
    toast.success(`تم إرسال الرسالة إلى ${to} بنجاح`)
    return true
  } else {
    toast.error(`فشل إرسال الرسالة إلى ${to}`)
    return false
  }
}

export const SMS_TEMPLATES = {
  CONFIRMATION: (name: string) => `مرحباً ${name}، تم تأكيد تسجيلك في حج 1447هـ مع فندق هوليداي إن بكة. نتطلع لخدمتكم.`,
  TRIP_REMINDER: (name: string, tripName: string, time: string) => `عزيزي ${name}، نذكركم بموعد رحلة (${tripName}) اليوم الساعة ${time}. يرجى التواجد في اللوبي قبل الموعد بـ 15 دقيقة.`,
  GENERAL_ALERT: (message: string) => `تنبيه من إدارة حج هوليداي إن: ${message}`,
}
