import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'features/auth/data/auth_repository.dart';
import 'features/auth/state/auth_provider.dart';
import 'features/auth/presentation/login_screen.dart';
import 'features/auth/presentation/otp_screen.dart';
import 'features/partner/presentation/become_partner_screen.dart';
import 'features/partner/presentation/partner_home_screen.dart';

// 👇 ये तीन imports orders system के लिए
import 'core/network/api_client.dart';
import 'features/orders/data/delivery_orders_api.dart';
import 'features/orders/state/delivery_orders_provider.dart';

void main() {
  runApp(const DeliveryPartnerApp());
}

class DeliveryPartnerApp extends StatelessWidget {
  const DeliveryPartnerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        // 1) AuthProvider (जैसा तुमने पहले रखा था)
        ChangeNotifierProvider(
          create: (_) => AuthProvider(AuthRepository()),
        ),

        // 2) ApiClient – base HTTP client (JWT token को headers में लगाएगा)
        Provider<ApiClient>(
          create: (_) => ApiClient(),
        ),

        // 3) DeliveryOrdersApi – ApiClient पर depend करता है
        ProxyProvider<ApiClient, DeliveryOrdersApi>(
          update: (_, apiClient, __) => DeliveryOrdersApi(apiClient),
        ),

        // 4) DeliveryOrdersProvider – ChangeNotifier, DeliveryOrdersApi पर depend
        ChangeNotifierProvider<DeliveryOrdersProvider>(
          create: (ctx) =>
              DeliveryOrdersProvider(ctx.read<DeliveryOrdersApi>()),
        ),

        // आगे चलकर तुम यहाँ:
        // - DeliveryPartnerProvider
        // - LocationProvider
        // वगैरह भी add कर सकते हो।
      ],
      child: MaterialApp(
        title: 'Delivery Partner App',
        theme: ThemeData(
          colorScheme: ColorScheme.fromSeed(seedColor: Colors.green),
          useMaterial3: true,
        ),
        // अभी login से flow शुरू हो रहा है:
        initialRoute: '/login',
        routes: {
          '/login': (_) => const LoginScreen(),
          '/otp': (_) => const OtpScreen(),
          '/become-partner': (_) => const BecomePartnerScreen(),
          '/partner-home': (_) => const PartnerHomeScreen(),
          // NOTE: Orders list screen को usually PartnerHome के अंदर से खोलोगे
          // अगर direct route चाहिए तो:
          // '/orders': (_) => const OrdersListScreen(),
        },
      ),
    );
  }
}