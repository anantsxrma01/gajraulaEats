import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../state/delivery_orders_provider.dart';
import '../data/delivery_order.dart';

class OrderDetailScreen extends StatelessWidget {
  final String orderId;

  const OrderDetailScreen({super.key, required this.orderId});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<DeliveryOrdersProvider>();
    final order = provider.findById(orderId);

    if (order == null) {
      // Fallback: ideally tum yaha API se specific order bhi fetch kar सकते हो
      return Scaffold(
        appBar: AppBar(title: const Text('Order Details')),
        body: const Center(child: Text('Order not found in local list')),
      );
    }

    return _OrderDetailBody(order: order);
  }
}

class _OrderDetailBody extends StatefulWidget {
  final DeliveryOrder order;

  const _OrderDetailBody({required this.order});

  @override
  State<_OrderDetailBody> createState() => _OrderDetailBodyState();
}

class _OrderDetailBodyState extends State<_OrderDetailBody> {
  bool _isUpdating = false;

  Future<void> _handlePick() async {
    setState(() => _isUpdating = true);
    try {
      await context
          .read<DeliveryOrdersProvider>()
          .markPicked(widget.order.id);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Marked as picked')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _isUpdating = false);
    }
  }

  Future<void> _handleDeliver() async {
    setState(() => _isUpdating = true);
    try {
      await context
          .read<DeliveryOrdersProvider>()
          .markDelivered(widget.order.id);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Order delivered')),
        );
        Navigator.of(context).pop(); // back to list
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _isUpdating = false);
    }
  }

  bool get _canPick {
    return widget.order.status == 'ASSIGNED' ||
        widget.order.status == 'READY_FOR_PICKUP';
  }

  bool get _canDeliver {
    return widget.order.status == 'PICKED';
  }

  @override
  Widget build(BuildContext context) {
    final order = context
            .watch<DeliveryOrdersProvider>()
            .findById(widget.order.id) ??
        widget.order;

    return Scaffold(
      appBar: AppBar(
        title: Text('Order #${order.orderNumber}'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            _InfoRow(
              title: 'Shop',
              value: '${order.shopName}\n${order.shopAddress}',
            ),
            const SizedBox(height: 12),
            _InfoRow(
              title: 'Drop Address',
              value: order.dropAddress,
            ),
            const SizedBox(height: 12),
            _InfoRow(
              title: 'Payment',
              value:
                  '${order.paymentMode} (${order.paymentStatus.toUpperCase()})',
            ),
            const SizedBox(height: 12),
            _InfoRow(
              title: 'Amount',
              value:
                  'Sub-total: ₹${order.subTotal.toStringAsFixed(0)}\nDelivery: ₹${order.deliveryCharge.toStringAsFixed(0)}\nTotal: ₹${order.totalAmount.toStringAsFixed(0)}',
            ),
            const SizedBox(height: 24),
            Row(
              children: [
                const Text(
                  'Status:',
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
                const SizedBox(width: 8),
                Chip(label: Text(order.status)),
              ],
            ),
            const Spacer(),
            if (_isUpdating) const CircularProgressIndicator(),
            if (!_isUpdating)
              Column(
                children: [
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: _canPick ? _handlePick : null,
                      child: const Text('Mark as Picked'),
                    ),
                  ),
                  const SizedBox(height: 8),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: _canDeliver ? _handleDeliver : null,
                      child: const Text('Mark as Delivered'),
                    ),
                  ),
                ],
              )
          ],
        ),
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  final String title;
  final String value;

  const _InfoRow({required this.title, required this.value});

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          width: 110,
          child: Text(
            title,
            style: const TextStyle(fontWeight: FontWeight.bold),
          ),
        ),
        const SizedBox(width: 8),
        Expanded(child: Text(value)),
      ],
    );
  }
}
