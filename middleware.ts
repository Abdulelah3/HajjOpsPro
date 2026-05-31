import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isPublicPath = path === '/login'

  // التحقق من وجود كوكي الجلسة
  const sessionCookie = request.cookies.get('hajj_session')?.value

  // إذا كان المستخدم مسجل دخوله ويحاول الوصول لصفحة تسجيل الدخول → تحويله للوحة التحكم
  if (isPublicPath && sessionCookie) {
    return NextResponse.redirect(new URL('/', request.nextUrl))
  }

  // إذا كان المستخدم غير مسجل دخوله ويحاول الوصول لصفحة محمية → تحويله لتسجيل الدخول
  if (!isPublicPath && !sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/pilgrims/:path*',
    '/trips/:path*',
    '/reports/:path*',
    '/notifications/:path*',
    '/settings/:path*',
    '/staff/:path*',
    '/nusuk/:path*',
    '/login'
  ],
}
