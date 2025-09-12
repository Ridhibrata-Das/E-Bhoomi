import { NextResponse } from 'next/server';
import mqtt, { MqttClient } from 'mqtt';

let client: MqttClient | null = null;

function getClient(): MqttClient {
  if (client && (client as any).connected) return client;

  const host = process.env.MQTT_URL || '';
  const port = Number(process.env.MQTT_PORT || 8883);
  const username = process.env.MQTT_USERNAME || '';
  const password = process.env.MQTT_PASSWORD || '';

  if (!host || !username || !password) {
    throw new Error('Missing MQTT configuration. Set MQTT_URL, MQTT_PORT, MQTT_USERNAME, MQTT_PASSWORD');
  }

  client = mqtt.connect({
    host,
    port,
    protocol: 'mqtts',
    username,
    password,
    reconnectPeriod: 1000,
  });

  return client;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const action: string = body?.action || body?.state || body?.value;
    if (!action || !['ON', 'OFF', 'on', 'off', 1, 0].includes(action)) {
      return NextResponse.json({ error: "Provide action/state as 'ON'|'OFF' (or 1|0)" }, { status: 400 });
    }

    const topic = process.env.MQTT_TOPIC || 'pumps/field1/cmd';
    const payload = (String(action).toUpperCase() === 'ON' || String(action) === '1') ? 'ON' : 'OFF';

    const c = getClient();

    await new Promise<void>((resolve, reject) => {
      c.publish(topic, payload, { qos: 1, retain: false }, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    return NextResponse.json({ success: true, sent: payload, topic });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unexpected error' }, { status: 500 });
  }
}


