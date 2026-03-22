import 'package:flutter/material.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});
  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  int _tab = 0;

  static const _orders = [
    {'id': 'ORD-9921', 'customer': '+91 98765XXXXX', 'items': 'Chicken Biryani x2, Raita x1', 'total': '₹490', 'status': 'PLACED', 'time': '2 mins ago'},
    {'id': 'ORD-9920', 'customer': '+91 87654XXXXX', 'items': 'Paneer Butter Masala, Naan x2', 'total': '₹340', 'status': 'PREPARING', 'time': '12 mins ago'},
    {'id': 'ORD-9919', 'customer': '+91 76543XXXXX', 'items': 'Cold Coffee x2', 'total': '₹240', 'status': 'READY_FOR_PICKUP', 'time': '28 mins ago'},
    {'id': 'ORD-9918', 'customer': '+91 65432XXXXX', 'items': 'Veg Momos x1, Sauce', 'total': '₹120', 'status': 'DELIVERED', 'time': '1 hr ago'},
  ];

  Color _statusColor(String s) {
    switch (s) {
      case 'PLACED':           return const Color(0xFF60A5FA);
      case 'PREPARING':        return const Color(0xFFFBBF24);
      case 'READY_FOR_PICKUP': return const Color(0xFF10B981);
      case 'DELIVERED':        return const Color(0xFF71717A);
      default:                 return const Color(0xFF71717A);
    }
  }

  String _nextAction(String s) {
    switch (s) {
      case 'PLACED':    return 'Accept Order';
      case 'PREPARING': return 'Mark Ready';
      default:          return '';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(children: [
          // Header
          Container(
            padding: const EdgeInsets.fromLTRB(20, 20, 20, 16),
            decoration: const BoxDecoration(
              border: Border(bottom: BorderSide(color: Color(0xFF27272A))),
            ),
            child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
              Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                const Text('Spicy Route', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 22, color: Colors.white)),
                const SizedBox(height: 2),
                Row(children: [
                  Container(width: 8, height: 8,
                    decoration: const BoxDecoration(color: Color(0xFF10B981), shape: BoxShape.circle)),
                  const SizedBox(width: 6),
                  const Text('Shop is Open', style: TextStyle(color: Color(0xFF10B981), fontSize: 12, fontWeight: FontWeight.w600)),
                ]),
              ]),
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: const Color(0xFF18181B), shape: BoxShape.circle,
                  border: Border.all(color: const Color(0xFF3F3F46)),
                ),
                child: const Icon(Icons.notifications_outlined, color: Colors.white, size: 22),
              ),
            ]),
          ),

          // Stat cards
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
            child: Row(children: [
              _StatCard(label: "Today's Revenue", value: '₹4,250', icon: '₹', color: const Color(0xFF10B981)),
              const SizedBox(width: 12),
              _StatCard(label: 'Active Orders', value: '3', icon: '📦', color: const Color(0xFF60A5FA)),
              const SizedBox(width: 12),
              _StatCard(label: 'Delivered', value: '28', icon: '✅', color: const Color(0xFF71717A)),
            ]),
          ),

          // Tabs
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 18, 16, 0),
            child: Row(children: ['Live Orders', 'Menu', 'Earnings'].asMap().entries.map((e) {
              final active = e.key == _tab;
              return GestureDetector(
                onTap: () => setState(() => _tab = e.key),
                child: Container(
                  margin: const EdgeInsets.only(right: 10),
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  decoration: BoxDecoration(
                    color: active ? const Color(0xFF10B981).withOpacity(0.15) : const Color(0xFF18181B),
                    borderRadius: BorderRadius.circular(50),
                    border: Border.all(color: active ? const Color(0xFF10B981).withOpacity(0.4) : const Color(0xFF3F3F46)),
                  ),
                  child: Text(e.value, style: TextStyle(
                    color: active ? const Color(0xFF10B981) : const Color(0xFF71717A),
                    fontSize: 13, fontWeight: FontWeight.w600,
                  )),
                ),
              );
            }).toList()),
          ),

          // Orders list
          Expanded(
            child: _tab == 0
              ? ListView.builder(
                  padding: const EdgeInsets.fromLTRB(16, 14, 16, 20),
                  itemCount: _orders.length,
                  itemBuilder: (ctx, i) => _OrderCard(
                    order: _orders[i],
                    statusColor: _statusColor(_orders[i]['status']!),
                    nextAction: _nextAction(_orders[i]['status']!),
                  ),
                )
              : Center(child: Text(
                  _tab == 1 ? 'Menu management coming soon…' : 'Earnings report coming soon…',
                  style: const TextStyle(color: Color(0xFF52525B), fontSize: 14),
                )),
          ),
        ]),
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String label, value, icon;
  final Color color;
  const _StatCard({required this.label, required this.value, required this.icon, required this.color});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: const Color(0xFF18181B),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: const Color(0xFF27272A)),
        ),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(icon, style: const TextStyle(fontSize: 18)),
          const SizedBox(height: 8),
          Text(value, style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: color)),
          const SizedBox(height: 2),
          Text(label, style: const TextStyle(fontSize: 10, color: Color(0xFF71717A)), maxLines: 1, overflow: TextOverflow.ellipsis),
        ]),
      ),
    );
  }
}

class _OrderCard extends StatelessWidget {
  final Map<String, String> order;
  final Color statusColor;
  final String nextAction;
  const _OrderCard({required this.order, required this.statusColor, required this.nextAction});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF18181B),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFF27272A)),
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        // Header row
        Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
          Text(order['id']!, style: const TextStyle(fontFamily: 'monospace', fontSize: 13, color: Color(0xFF10B981), fontWeight: FontWeight.w700)),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: statusColor.withOpacity(0.1),
              borderRadius: BorderRadius.circular(50),
              border: Border.all(color: statusColor.withOpacity(0.25)),
            ),
            child: Text(order['status']!, style: TextStyle(color: statusColor, fontSize: 10, fontWeight: FontWeight.w700)),
          ),
        ]),
        const SizedBox(height: 10),
        // Customer + time
        Row(children: [
          const Icon(Icons.person_outline, size: 14, color: Color(0xFF71717A)),
          const SizedBox(width: 6),
          Text(order['customer']!, style: const TextStyle(fontSize: 12, color: Color(0xFFA1A1AA))),
          const Spacer(),
          Text(order['time']!, style: const TextStyle(fontSize: 11, color: Color(0xFF52525B))),
        ]),
        const SizedBox(height: 6),
        // Items
        Row(children: [
          const Icon(Icons.restaurant_menu, size: 14, color: Color(0xFF71717A)),
          const SizedBox(width: 6),
          Expanded(child: Text(order['items']!, style: const TextStyle(fontSize: 12, color: Color(0xFFA1A1AA)), overflow: TextOverflow.ellipsis)),
        ]),
        const SizedBox(height: 14),
        const Divider(color: Color(0xFF27272A), height: 1),
        const SizedBox(height: 12),
        Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
          Text(order['total']!, style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w800, color: Colors.white)),
          if (nextAction.isNotEmpty)
            ElevatedButton(
              onPressed: () {},
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF10B981),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                minimumSize: Size.zero, tapTargetSize: MaterialTapTargetSize.shrinkWrap,
              ),
              child: Text(nextAction, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700)),
            )
          else
            const Text('Completed', style: TextStyle(fontSize: 12, color: Color(0xFF52525B))),
        ]),
      ]),
    );
  }
}
