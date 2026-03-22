import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../auth/state/auth_provider.dart';

class BecomePartnerScreen extends StatefulWidget {
  const BecomePartnerScreen({super.key});

  @override
  State<BecomePartnerScreen> createState() => _BecomePartnerScreenState();
}

class _BecomePartnerScreenState extends State<BecomePartnerScreen> {
  String _vehicleType = 'BIKE';
  bool _isSubmitting = false;

  Future<void> _register() async {
    setState(() => _isSubmitting = true);
    final auth = context.read<AuthProvider>();

    await auth.registerAsDeliveryPartner(_vehicleType);

    setState(() => _isSubmitting = false);

    if (auth.partner != null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('You are now a delivery partner!')),
      );
      Navigator.pushNamedAndRemoveUntil(
        context,
        '/partner-home',
        (_) => false,
      );
    } else if (auth.status == AuthStatus.error) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(auth.errorMessage ?? 'Error registering')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = context.watch<AuthProvider>().user;

    return Scaffold(
      appBar: AppBar(title: const Text('Become Delivery Partner')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Hi ${user?.phone ?? ""} 👋'),
            const SizedBox(height: 8),
            const Text(
              'कुछ basic details दो और partner बन जाओ।',
              style: TextStyle(fontSize: 16),
            ),
            const SizedBox(height: 16),
            const Text('Vehicle Type'),
            const SizedBox(height: 8),
            DropdownButton<String>(
              value: _vehicleType,
              items: const [
                DropdownMenuItem(
                  value: 'BIKE',
                  child: Text('Bike'),
                ),
                DropdownMenuItem(
                  value: 'SCOOTER',
                  child: Text('Scooter'),
                ),
                DropdownMenuItem(
                  value: 'CYCLE',
                  child: Text('Cycle'),
                ),
              ],
              onChanged: (val) {
                if (val != null) {
                  setState(() => _vehicleType = val);
                }
              },
            ),
            const Spacer(),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _isSubmitting ? null : _register,
                child: _isSubmitting
                    ? const CircularProgressIndicator()
                    : const Text('Register as Partner'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
