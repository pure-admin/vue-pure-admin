<script setup lang="ts">
// vue 3 + vite use MQTT.js refer to https://github.com/mqttjs/MQTT.js/issues/1269
import * as mqtt from "mqtt/dist/mqtt.min";
import { reactive, ref, onUnmounted } from "vue";

const protocol = location.protocol === "https:" ? "wss" : "ws";
const port = protocol === "wss" ? 8084 : 8083;

// https://github.com/mqttjs/MQTT.js#qos
const qosList = [0, 1, 2];

const connection = reactive({
  protocol,
  host: "broker.emqx.io",
  port,
  clientId: "emqx_vue3_" + Math.random().toString(16).substring(2, 8),
  username: "emqx_test",
  password: "emqx_test",
  clean: true,
  connectTimeout: 30 * 1000, // ms
  reconnectPeriod: 4000 // ms
  // for more options and details, please refer to https://github.com/mqttjs/MQTT.js#mqttclientstreambuilder-options
});

// 订阅 topic/mqttx 主题
const subscription = ref({
  topic: "topic/mqttx",
  qos: 0 as any
});

// 发布 topic/browser 主题
const publish = ref({
  topic: "topic/browser",
  qos: 0 as any,
  payload: '{ "msg": "Hello, I am browser." }'
});

let client = ref({
  connected: false
} as mqtt.MqttClient);

const receivedMessages = ref("");
const subscribedSuccess = ref(false);
const btnLoadingType = ref("");
const retryTimes = ref(0);

const initData = () => {
  client.value = {
    connected: false
  } as mqtt.MqttClient;
  retryTimes.value = 0;
  btnLoadingType.value = "";
  subscribedSuccess.value = false;
};

const handleOnReConnect = () => {
  retryTimes.value += 1;
  if (retryTimes.value > 5) {
    try {
      client.value.end();
      initData();
      console.log("connection maxReconnectTimes limit, stop retry");
    } catch (error) {
      console.log("handleOnReConnect catch error:", error);
    }
  }
};

const createConnection = () => {
  try {
    btnLoadingType.value = "connect";
    const { protocol, host, port, ...options } = connection;
    const connectUrl = `${protocol}://${host}:${port}/mqtt`;
    // 连接MQTT 服务器
    client.value = mqtt.connect(connectUrl, options);

    if (client.value.on) {
      // https://github.com/mqttjs/MQTT.js#event-connect
      client.value.on("connect", () => {
        btnLoadingType.value = "";
        console.log("connection successful");
      });

      // https://github.com/mqttjs/MQTT.js#event-reconnect
      client.value.on("reconnect", handleOnReConnect);

      // https://github.com/mqttjs/MQTT.js#event-error
      client.value.on("error", error => {
        console.log("connection error:", error);
      });

      // https://github.com/mqttjs/MQTT.js#event-message
      client.value.on("message", (topic: string, message) => {
        receivedMessages.value = receivedMessages.value.concat(
          message.toString()
        );
        console.log(`received message: ${message} from topic: ${topic}`);
      });
    }
  } catch (error) {
    btnLoadingType.value = "";
    console.log("mqtt.connect error:", error);
  }
};

// subscribe topic
// https://github.com/mqttjs/MQTT.js#mqttclientsubscribetopictopic-arraytopic-object-options-callback
const doSubscribe = () => {
  btnLoadingType.value = "subscribe";
  const { topic, qos } = subscription.value;
  client.value.subscribe(
    topic,
    { qos },
    (error: Error, granted: mqtt.ISubscriptionGrant[]) => {
      btnLoadingType.value = "";
      if (error) {
        console.log("subscribe error:", error);
        return;
      }
      subscribedSuccess.value = true;
      console.log("subscribe successfully:", granted);
    }
  );
};

// unsubscribe topic
// https://github.com/mqttjs/MQTT.js#mqttclientunsubscribetopictopic-array-options-callback
const doUnSubscribe = () => {
  btnLoadingType.value = "unsubscribe";
  const { topic, qos } = subscription.value;
  client.value.unsubscribe(topic, { qos }, error => {
    btnLoadingType.value = "";
    subscribedSuccess.value = false;
    if (error) {
      console.log("unsubscribe error:", error);
      return;
    }
    console.log(`unsubscribed topic: ${topic}`);
  });
};

// publish message
// https://github.com/mqttjs/MQTT.js#mqttclientpublishtopic-message-options-callback
const doPublish = () => {
  btnLoadingType.value = "publish";
  const { topic, qos, payload } = publish.value;
  client.value.publish(topic, payload, { qos }, error => {
    btnLoadingType.value = "";
    if (error) {
      console.log("publish error:", error);
      return;
    }
    console.log(`published message: ${payload}`);
  });
};

// disconnect
// https://github.com/mqttjs/MQTT.js#mqttclientendforce-options-callback
const destroyConnection = () => {
  if (client.value.connected) {
    btnLoadingType.value = "disconnect";
    try {
      client.value.end(false, () => {
        initData();
        console.log("disconnected successfully");
      });
    } catch (error) {
      btnLoadingType.value = "";
      console.log("disconnect error:", error);
    }
  }
};

const handleProtocolChange = (value: string) => {
  connection.port = value === "wss" ? 8084 : 8083;
};

onUnmounted(() => {
  try {
    if (client.value.end) {
      client.value.end();
      console.log("disconnected successfully");
    }
  } catch (error) {
    console.log(error);
  }
});
</script>

<template>
  <el-card shadow="never" :body-style="{ padding: '20px' }">
    <template #header>
      <div>
        基于
        <el-link
          type="primary"
          :underline="false"
          href="https://github.com/mqttjs/MQTT.js"
          target="_blank"
        >
          MQTT.js
        </el-link>
        和 免费的公共MQTT代理
        <el-link
          type="primary"
          :underline="false"
          href="broker.emqx.io"
          target="_blank"
        >
          EMQX
        </el-link>
        实现的一套 MQTT 客户端
      </div>
      <el-link
        class="mt-2"
        href="https://github.com/pure-admin/vue-pure-admin/blob/main/src/views/able/mqtt-client.vue"
        target="_blank"
      >
        代码位置 src/views/able/mqtt-client.vue
      </el-link>
    </template>

    <el-card shadow="never">
      <h1>设置</h1>
      <el-form label-position="top" :model="connection">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item prop="protocol" label="协议">
              <el-select
                v-model="connection.protocol"
                @change="handleProtocolChange"
              >
                <el-option label="ws://" value="ws" />
                <el-option label="wss://" value="wss" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="host" label="主机">
              <el-input v-model="connection.host" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="port" label="端口">
              <el-input
                v-model.number="connection.port"
                type="number"
                placeholder="8083/8084"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="clientId" label="客户端ID">
              <el-input v-model="connection.clientId" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="username" label="用户名">
              <el-input v-model="connection.username" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="password" label="密码">
              <el-input v-model="connection.password" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-button
              type="primary"
              :disabled="client.connected"
              :loading="btnLoadingType === 'connect'"
              @click="createConnection"
            >
              {{ client.connected ? "已连接" : "连接" }}
            </el-button>

            <el-button
              v-if="client.connected"
              type="danger"
              :loading="btnLoadingType === 'disconnect'"
              @click="destroyConnection"
            >
              断开连接
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card shadow="never" class="mt-4">
      <h1>订阅</h1>
      <el-form label-position="top" :model="subscription">
        <el-row :gutter="20" :align="'middle'">
          <el-col :span="8">
            <el-form-item prop="topic" label="主题">
              <el-input
                v-model="subscription.topic"
                :disabled="subscribedSuccess"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="qos" label="通信质量">
              <el-select
                v-model="subscription.qos"
                :disabled="subscribedSuccess"
              >
                <el-option
                  v-for="qos in qosList"
                  :key="qos"
                  :label="qos"
                  :value="qos"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-button
              type="primary"
              class="sub-btn"
              :loading="btnLoadingType === 'subscribe'"
              :disabled="!client.connected || subscribedSuccess"
              @click="doSubscribe"
            >
              {{ subscribedSuccess ? "已订阅" : "订阅" }}
            </el-button>
            <el-button
              v-if="subscribedSuccess"
              type="primary"
              class="sub-btn"
              :loading="btnLoadingType === 'unsubscribe'"
              :disabled="!client.connected"
              @click="doUnSubscribe"
            >
              取消订阅
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card shadow="never" class="mt-4">
      <h1>发布</h1>
      <el-form label-position="top" :model="publish">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item prop="topic">
              <template #label>
                <span>主题</span>
                <el-text type="info" size="small">
                  可将订阅主题设置为topic/browser，测试MQTT的自发自收。
                </el-text>
              </template>
              <el-input v-model="publish.topic" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="payload" label="有效载荷">
              <el-input v-model="publish.payload" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="qos" label="通信质量">
              <el-select v-model="publish.qos">
                <el-option
                  v-for="qos in qosList"
                  :key="qos"
                  :label="qos"
                  :value="qos"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-col :span="24">
        <el-button
          type="primary"
          :loading="btnLoadingType === 'publish'"
          :disabled="!client.connected"
          @click="doPublish"
        >
          发布
        </el-button>
      </el-col>
    </el-card>
    <el-card shadow="never" class="mt-4">
      <h1>接收</h1>
      <el-col :span="24">
        <el-input
          v-model="receivedMessages"
          type="textarea"
          :rows="3"
          readonly
        />
      </el-col>
    </el-card>
  </el-card>
</template>
