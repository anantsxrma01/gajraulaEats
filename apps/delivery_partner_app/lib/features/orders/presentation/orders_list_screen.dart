import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';

import '../state/delivery_orders_provider.dart';
import '../data/delivery_order.dart';
import 'order_detail_screen.dart';

class OrdersListScreen extends StatefulWidget {
  const OrdersListScreen({super.key});

  @override
  State<OrdersListScreen> createState() => _OrdersListScreenState();
}

class _OrdersListScreenState extends State<OrdersListScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() =>
        context.read<DeliveryOrdersProvider>().loadOrders());
  }

  Future<void> _onRefresh() async {
    await context.read<DeliveryOrdersProvider>().loadOrders();
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<DeliveryOrdersProvider>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Assigned Orders'),
      ),
      body: RefreshIndicator(
        onRefresh: _onRefresh,
        child: provider.isLoading
            ? const Center(child: CircularProgressIndicator())
            : provider.error != null
                ? ListView(
                    children: [
                      Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Text(
                          'Error: ${provider.error}',
                          style: const TextStyle(color: Colors.red),
                        ),
                      ),
                    ],
                  )
                : provider.orders.isEmpty
                    ? ListView(
                        children: const [
                          SizedBox(height: 60),
                          Center(
                              child: Text(
                                  'Currently no orders assigned.\nStay online to receive new orders.',
                                  textAlign: TextAlign.center)),
                        ],
                      )
                    : ListView.builder(
                        itemCount: provider.orders.length,
                        itemBuilder: (ctx, i) {
                          final order = provider.orders[i];
                          return _OrderCard(order: order);
                        },
                      ),
      ),
    );
  }
}

class _OrderCard extends StatelessWidget {
  final DeliveryOrder order;

  const _OrderCard({required this.order});

  Color _statusColor(String status) {
    switch (status) {
      case 'ASSIGNED':
        return Colors.orange;
      case 'PICKED':
        return Colors.blue;
      case 'DELIVERED':
        return Colors.green;
      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    final df = DateFormat('dd MMM, hh:mm a');

    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      child: ListTile(
        onTap: () {
          Navigator.of(context).push(
            MaterialPageRoute(
              builder: (_) => OrderDetailScreen(orderId: order.id),
            ),
          );
        },
        title: Text('Order #${order.orderNumber}'),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Shop: ${order.shopName}'),
            Text('Drop: ${order.dropAddress}'),
            Text('Total: ₹${order.totalAmount.toStringAsFixed(0)}'),
            Text('Created: ${df.format(order.createdAt)}'),
          ],
        ),
        trailing: Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
          decoration: BoxDecoration(
            color: _statusColor(order.status).withOpacity(0.15),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Text(
            order.status,
            style: TextStyle(
              color: _statusColor(order.status),
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
      ),
    );
  }
}
