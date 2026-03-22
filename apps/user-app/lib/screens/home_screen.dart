import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

const String _kApiBase = 'https://gajraulaeats.onrender.com/api';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});
  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  List<dynamic> _shops = [];
  bool _loading = true;

  static const _fallback = [
    {'_id': 'f1', 'name': 'Spicy Route', 'rating': 4.8, 'tags': ['North Indian', 'Biryani'], 'delivery_time': '25-30 min', 'delivery_fee': 40},
    {'_id': 'f2', 'name': 'Burger & Brews', 'rating': 4.5, 'tags': ['Fast Food', 'American'], 'delivery_time': '15-20 min', 'delivery_fee': 0},
    {'_id': 'f3', 'name': 'Sushi Sensation', 'rating': 4.9, 'tags': ['Japanese', 'Sushi'], 'delivery_time': '30-40 min', 'delivery_fee': 60},
  ];

  @override
  void initState() {
    super.initState();
    _fetchShops();
  }

  Future<void> _fetchShops() async {
    try {
      final res = await http.get(Uri.parse('$_kApiBase/shops')).timeout(const Duration(seconds: 8));
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        setState(() { _shops = (data['shops'] as List?) ?? _fallback; });
      } else {
        setState(() => _shops = _fallback);
      }
    } catch (_) {
      setState(() => _shops = _fallback);
    } finally {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // App Bar
          SliverAppBar(
            expandedHeight: 180,
            floating: false,
            pinned: true,
            backgroundColor: const Color(0xFF09090B),
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [Color(0xFF1A0808), Color(0xFF09090B)],
                  ),
                ),
                child: SafeArea(
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(20, 16, 20, 0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                          const Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('Deliver to', style: TextStyle(color: Color(0xFF71717A), fontSize: 12)),
                              Row(children: [
                                Text('Gajraula, UP', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 15)),
                                SizedBox(width: 4),
                                Icon(Icons.keyboard_arrow_down, color: Color(0xFFEF4444), size: 18),
                              ]),
                            ],
                          ),
                          Container(
                            width: 40, height: 40,
                            decoration: BoxDecoration(
                              color: const Color(0xFF18181B), shape: BoxShape.circle,
                              border: Border.all(color: const Color(0xFF3F3F46)),
                            ),
                            child: const Icon(Icons.notifications_outlined, color: Colors.white, size: 20),
                          ),
                        ]),
                        const SizedBox(height: 16),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                          decoration: BoxDecoration(
                            color: const Color(0xFF18181B),
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(color: const Color(0xFF3F3F46)),
                          ),
                          child: const Row(children: [
                            Icon(Icons.search, color: Color(0xFF71717A), size: 20),
                            SizedBox(width: 10),
                            Text('Search restaurants or dishes…', style: TextStyle(color: Color(0xFF71717A), fontSize: 14)),
                          ]),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),

          // Categories
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 20, 0, 4),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                const Text('Cuisines', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 16, color: Colors.white)),
                const SizedBox(height: 12),
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: ['🍕 Pizza', '🍔 Burger', '🍜 Chinese', '🥗 Healthy', '🍣 Sushi', '🍩 Desserts'].map((c) {
                      return Container(
                        margin: const EdgeInsets.only(right: 10),
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        decoration: BoxDecoration(
                          color: const Color(0xFF18181B),
                          borderRadius: BorderRadius.circular(50),
                          border: Border.all(color: const Color(0xFF3F3F46)),
                        ),
                        child: Text(c, style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w500)),
                      );
                    }).toList(),
                  ),
                ),
              ]),
            ),
          ),

          // Section title
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 24, 20, 12),
              child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                const Text('Nearby Restaurants', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 18, color: Colors.white)),
                Text('See all', style: TextStyle(color: const Color(0xFFEF4444), fontSize: 13, fontWeight: FontWeight.w600)),
              ]),
            ),
          ),

          // Restaurant list
          _loading
            ? const SliverFillRemaining(child: Center(child: CircularProgressIndicator(color: Color(0xFFEF4444))))
            : SliverList(
                delegate: SliverChildBuilderDelegate(
                  (context, i) => _RestaurantCard(shop: _shops[i]),
                  childCount: _shops.length,
                ),
              ),

          const SliverToBoxAdapter(child: SizedBox(height: 100)),
        ],
      ),
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          color: Color(0xFF18181B),
          border: Border(top: BorderSide(color: Color(0xFF27272A))),
        ),
        child: BottomNavigationBar(
          backgroundColor: Colors.transparent,
          elevation: 0,
          selectedItemColor: const Color(0xFFEF4444),
          unselectedItemColor: const Color(0xFF71717A),
          currentIndex: 0,
          items: const [
            BottomNavigationBarItem(icon: Icon(Icons.home_rounded), label: 'Home'),
            BottomNavigationBarItem(icon: Icon(Icons.receipt_long_rounded), label: 'Orders'),
            BottomNavigationBarItem(icon: Icon(Icons.person_rounded), label: 'Profile'),
          ],
          onTap: (i) { if (i == 1) Navigator.pushNamed(context, '/orders'); },
        ),
      ),
    );
  }
}

class _RestaurantCard extends StatelessWidget {
  final dynamic shop;
  const _RestaurantCard({required this.shop});

  @override
  Widget build(BuildContext context) {
    final tags = (shop['tags'] as List?)?.cast<String>() ?? ['Various'];
    final fee = (shop['delivery_fee'] ?? 0) == 0 ? 'Free Delivery' : '₹${shop['delivery_fee']}';
    final rating = (shop['rating'] ?? 4.5).toDouble();

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      decoration: BoxDecoration(
        color: const Color(0xFF18181B),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFF27272A)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Image placeholder
          Container(
            height: 160,
            decoration: BoxDecoration(
              borderRadius: const BorderRadius.vertical(top: Radius.circular(18)),
              gradient: LinearGradient(
                colors: [const Color(0xFF27272A), const Color(0xFF18181B)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
            child: const Center(child: Text('🍽️', style: TextStyle(fontSize: 48))),
          ),
          Padding(
            padding: const EdgeInsets.all(14),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                Text(shop['name'] ?? 'Restaurant',
                  style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 16, color: Colors.white)),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: const Color(0xFF16A34A).withOpacity(0.12),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Row(mainAxisSize: MainAxisSize.min, children: [
                    const Icon(Icons.star_rounded, size: 13, color: Color(0xFF4ADE80)),
                    const SizedBox(width: 3),
                    Text('$rating', style: const TextStyle(color: Color(0xFF4ADE80), fontWeight: FontWeight.w600, fontSize: 12)),
                  ]),
                ),
              ]),
              const SizedBox(height: 6),
              Text(tags.join(' · '), style: const TextStyle(color: Color(0xFF71717A), fontSize: 12)),
              const SizedBox(height: 10),
              Row(children: [
                const Icon(Icons.access_time, size: 13, color: Color(0xFF71717A)),
                const SizedBox(width: 4),
                Text(shop['delivery_time'] ?? '30-40 min', style: const TextStyle(color: Color(0xFFA1A1AA), fontSize: 12)),
                const SizedBox(width: 14),
                const Icon(Icons.delivery_dining, size: 13, color: Color(0xFF71717A)),
                const SizedBox(width: 4),
                Text(fee, style: const TextStyle(color: Color(0xFFA1A1AA), fontSize: 12)),
              ]),
            ]),
          ),
        ],
      ),
    );
  }
}
