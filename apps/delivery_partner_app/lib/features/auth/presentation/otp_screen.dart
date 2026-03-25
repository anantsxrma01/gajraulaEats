import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../state/auth_provider.dart';

class OtpScreen extends StatefulWidget {
  const OtpScreen({super.key});

  @override
  State<OtpScreen> createState() => _OtpScreenState();
}

class _OtpScreenState extends State<OtpScreen> {
  final _otpController = TextEditingController();
  bool _isVerifying = false;

  @override
  void dispose() {
    _otpController.dispose();
    super.dispose();
  }

  Future<void> _verifyOtp(String phone) async {
    final otp = _otpController.text.trim();
    if (otp.length < 4) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a valid OTP')),
      );
      return;
    }

    setState(() => _isVerifying = true);
    final auth = context.read<AuthProvider>();

    await auth.verifyOtp(phone, otp);

    setState(() => _isVerifying = false);

    if (auth.status == AuthStatus.authenticated) {
      // Auth हो गया, अब check करेंगे partner profile
      if (auth.partner != null || auth.isDeliveryPartner) {
        Navigator.pushNamedAndRemoveUntil(
          context,
          '/partner-home',
          (_) => false,
        );
      } else {
        Navigator.pushNamedAndRemoveUntil(
          context,
          '/become-partner',
          (_) => false,
        );
      }
    } else if (auth.status == AuthStatus.error) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(auth.errorMessage ?? 'OTP verify fail')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final phone = ModalRoute.of(context)!.settings.arguments as String;

    return Scaffold(
      appBar: AppBar(title: const Text('Enter OTP')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Text('OTP भेजा गया है: $phone'),
            const SizedBox(height: 16),
            TextField(
              controller: _otpController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                labelText: 'OTP',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed:
                    _isVerifying ? null : () => _verifyOtp(phone),
                child: _isVerifying
                    ? const CircularProgressIndicator()
                    : const Text('Verify & Continue'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
