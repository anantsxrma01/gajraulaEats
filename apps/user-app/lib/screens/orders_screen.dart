import 'package:flutter/material.dart';

class OrdersScreen extends StatelessWidget {
  const OrdersScreen({super.key});

  static const _mockOrders = [
    {'id': 'ORD-9921', 'shop': 'Spicy Route', 'items': 'Chicken Biryani x2', 'total': '₹450', 'status': 'Preparing'},
    {'id': 'ORD-9920', 'shop': 'Burger & Brews', 'items': 'Zinger Burger x1', 'total': '₹220', 'status': 'Out for Delivery'},
    {'id': 'ORD-9919', 'shop': 'Sushi Sensation', 'items': 'Dragon Roll x2', 'total': '₹680', 'status': 'Delivered'},
  ];

  Color _statusColor(String s) {
    if (s == 'Delivered')        return const Color(0xFF4ADE80);
    if (s == 'Out for Delivery') return const Color(0xFFFBBF24);
    return const Color(0xFF60A5FA);
  }

  Color _statusBg(String s) => _statusColor(s).withOpacity(0.1);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Orders'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_rounded),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(20),
        itemCount: _mockOrders.length,
        itemBuilder: (context, i) {
          final o = _mockOrders[i];
          final statusColor = _statusColor(o['status']!);
          final statusBg    = _statusBg(o['status']!);
          return Container(
            margin: const EdgeInsets.only(bottom: 14),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF18181B),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFF27272A)),
            ),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                Text(o['id']!, style: const TextStyle(fontFamily: 'monospace', fontSize: 13, color: Color(0xFFA78BFA), fontWeight: FontWeight.w700)),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(color: statusBg, borderRadius: BorderRadius.circular(50)),
                  child: Text(o['status']!, style: TextStyle(color: statusColor, fontSize: 11, fontWeight: FontWeight.w600)),
                ),
              ]),
              const SizedBox(height: 8),
              Text(o['shop']!, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: Colors.white)),
              const SizedBox(height: 4),
              Text(o['items']!, style: const TextStyle(fontSize: 13, color: Color(0xFF71717A))),
              const SizedBox(height: 12),
              const Divider(color: Color(0xFF27272A), height: 1),
              const SizedBox(height: 12),
              Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                Text(o['total']!, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: Colors.white)),
                TextButton(
                  onPressed: () {},
                  style: TextButton.styleFrom(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                    backgroundColor: const Color(0xFFEF4444).withOpacity(0.1),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                  ),
                  child: const Text('Track Order', style: TextStyle(color: Color(0xFFEF4444), fontSize: 12, fontWeight: FontWeight.w600)),
                ),
              ]),
            ]),
          );
        },
      ),
    );
  }
}
