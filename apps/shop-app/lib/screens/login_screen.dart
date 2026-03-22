import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

const _kApiBase = 'https://gajraulaeats.onrender.com/api';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});
  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _phoneCtrl = TextEditingController();
  final _otpCtrl   = TextEditingController();
  bool _isOtpStep  = false;
  bool _loading    = false;
  String _error    = '';

  Future<void> _sendOtp() async {
    setState(() { _loading = true; _error = ''; });
    try {
      final res = await http.post(
        Uri.parse('$_kApiBase/auth/send-otp'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'phone': _phoneCtrl.text.trim()}),
      );
      if (res.statusCode == 200) {
        setState(() => _isOtpStep = true);
      } else {
        setState(() => _error = jsonDecode(res.body)['message'] ?? 'Error');
      }
    } catch (_) {
      setState(() => _error = 'Network error. Please try again.');
    } finally {
      setState(() => _loading = false);
    }
  }

  Future<void> _verifyOtp() async {
    setState(() { _loading = true; _error = ''; });
    try {
      final res = await http.post(
        Uri.parse('$_kApiBase/auth/verify-otp'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'phone': _phoneCtrl.text.trim(), 'otp': _otpCtrl.text.trim()}),
      );
      if (res.statusCode == 200) {
        if (!mounted) return;
        Navigator.pushReplacementNamed(context, '/dashboard');
      } else {
        setState(() => _error = jsonDecode(res.body)['message'] ?? 'Invalid OTP');
      }
    } catch (_) {
      setState(() => _error = 'Network error. Please try again.');
    } finally {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter, end: Alignment.bottomCenter,
            colors: [Color(0xFF071A12), Color(0xFF09090B)],
          ),
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 28),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 60),
                // Logo
                Container(
                  width: 56, height: 56,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(colors: [Color(0xFF10B981), Color(0xFF059669)]),
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [BoxShadow(color: const Color(0xFF10B981).withOpacity(0.4), blurRadius: 24)],
                  ),
                  child: const Center(child: Text('🏪', style: TextStyle(fontSize: 26))),
                ),
                const SizedBox(height: 24),
                Text(
                  _isOtpStep ? 'Verify OTP' : 'Shop Panel',
                  style: const TextStyle(fontSize: 30, fontWeight: FontWeight.w800, color: Colors.white),
                ),
                const SizedBox(height: 6),
                Text(
                  _isOtpStep
                    ? 'Enter code sent to +91 ${_phoneCtrl.text}'
                    : 'Login to manage your orders and menu',
                  style: const TextStyle(fontSize: 14, color: Color(0xFF71717A), height: 1.5),
                ),
                const SizedBox(height: 36),

                if (!_isOtpStep)
                  Container(
                    decoration: BoxDecoration(
                      color: const Color(0xFF18181B),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: const Color(0xFF3F3F46)),
                    ),
                    child: Row(children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 16),
                        decoration: const BoxDecoration(border: Border(right: BorderSide(color: Color(0xFF3F3F46)))),
                        child: const Text('+91', style: TextStyle(color: Color(0xFFA1A1AA), fontWeight: FontWeight.w600)),
                      ),
                      Expanded(
                        child: TextField(
                          controller: _phoneCtrl,
                          keyboardType: TextInputType.phone,
                          style: const TextStyle(color: Colors.white, fontSize: 16),
                          decoration: const InputDecoration(
                            filled: false, border: InputBorder.none,
                            hintText: 'Owner phone number',
                            contentPadding: EdgeInsets.symmetric(horizontal: 14),
                          ),
                        ),
                      ),
                    ]),
                  )
                else
                  TextField(
                    controller: _otpCtrl,
                    keyboardType: TextInputType.number,
                    textAlign: TextAlign.center, maxLength: 6,
                    style: const TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.w700, letterSpacing: 14),
                    decoration: InputDecoration(
                      counterText: '',
                      filled: true, fillColor: const Color(0xFF18181B),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: Color(0xFF3F3F46))),
                      enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: Color(0xFF3F3F46))),
                      focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: Color(0xFF10B981), width: 2)),
                      hintText: '• • • •',
                      hintStyle: const TextStyle(letterSpacing: 14, fontSize: 24, color: Color(0xFF52525B)),
                    ),
                  ),

                if (_error.isNotEmpty) ...[
                  const SizedBox(height: 12),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFFEF4444).withOpacity(0.1),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: const Color(0xFFEF4444).withOpacity(0.2)),
                    ),
                    child: Text(_error, style: const TextStyle(color: Color(0xFFF87171), fontSize: 13)),
                  ),
                ],

                const SizedBox(height: 24),
                SizedBox(
                  width: double.infinity, height: 52,
                  child: ElevatedButton(
                    onPressed: _loading ? null : (_isOtpStep ? _verifyOtp : _sendOtp),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF10B981),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      elevation: 0,
                    ),
                    child: _loading
                      ? const SizedBox(width: 22, height: 22, child: CircularProgressIndicator(strokeWidth: 2.5, color: Colors.white))
                      : Text(_isOtpStep ? 'Verify & Enter' : 'Send OTP',
                          style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700)),
                  ),
                ),
                if (_isOtpStep) ...[
                  const SizedBox(height: 16),
                  Center(
                    child: TextButton(
                      onPressed: () => setState(() { _isOtpStep = false; _error = ''; }),
                      child: const Text('← Change number', style: TextStyle(color: Color(0xFF71717A), fontSize: 13)),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}
