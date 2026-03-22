import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../auth/state/auth_provider.dart';

class PartnerHomeScreen extends StatelessWidget {
  const PartnerHomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final user = auth.user;
    final partner = auth.partner;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Delivery Partner Home'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              await auth.logout();
              Navigator.pushNamedAndRemoveUntil(
                context,
                '/login',
                (_) => false,
              );
            },
          )
        ],
      ),
      body: partner == null
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text('No partner profile found.'),
                  const SizedBox(height: 8),
                  ElevatedButton(
                    onPressed: () {
                      Navigator.pushNamed(context, '/become-partner');
                    },
                    child: const Text('Become Partner'),
                  )
                ],
              ),
            )
          : Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Welcome, ${user?.phone ?? ""}',
                      style: const TextStyle(
                          fontSize: 18, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 16),
                  Text('Status: ${partner.status}'),
                  Text('Vehicle: ${partner.vehicleType}'),
                  Text('Online: ${partner.isOnline ? "Yes" : "No"}'),
                  Text('Total Trips: ${partner.totalTrips}'),
                  const SizedBox(height: 24),
                  const Text(
                    'Next steps:',
                    style:
                        TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                  ),
                  const SizedBox(height: 8),
                  const Text('• D3 में यहां Online/Offline toggle और location आएगा'),
                  const Text('• D4 में Assigned orders list और pick/deliver flow आएगा'),
                ],
              ),
            ),
    );
  }
}
