import Stripe from 'stripe';
import * as fs from 'fs';
import * as path from 'path';

const envPath = path.resolve('.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const secretKeyMatch = envContent.match(/STRIPE_SECRET_KEY=(sk_test_[A-Za-z0-9_]+)/);

if (!secretKeyMatch) {
  console.error("No STRIPE_SECRET_KEY found in .env.local");
  process.exit(1);
}

const stripe = new Stripe(secretKeyMatch[1], { apiVersion: '2023-10-16' as any });

async function setup() {
  const plans = [
    { name: 'BorderBooks Starter', amount: 4900, envKey: 'STRIPE_PRICE_STARTER' },
    { name: 'BorderBooks Professional', amount: 14900, envKey: 'STRIPE_PRICE_PROFESSIONAL' },
    { name: 'BorderBooks Enterprise', amount: 49900, envKey: 'STRIPE_PRICE_ENTERPRISE' },
  ];

  let newEnv = envContent;
  for (const plan of plans) {
    const product = await stripe.products.create({ name: plan.name });
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: plan.amount,
      currency: 'usd',
      recurring: { interval: 'month' },
    });
    const pattern = new RegExp(`${plan.envKey}=.*`);
    if (pattern.test(newEnv)) {
      newEnv = newEnv.replace(pattern, `${plan.envKey}=${price.id}`);
    } else {
      newEnv += `\n${plan.envKey}=${price.id}`;
    }
  }

  fs.writeFileSync(envPath, newEnv);
  console.log('Stripe Starter ($49/mo), Professional ($149/mo), and Enterprise ($499/mo) prices created and .env.local updated.');
}

setup().catch(console.error);
