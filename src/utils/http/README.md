## 用法

### Get 请求

```
import { http } from "/@/utils/http";

// params传参
http.request('get', '/xxx', { params: param });

// url拼接传参
http.request('get', '/xxx?message=' + msg);
```

### Post 请求

```
import { http } from "/@/utils/http";

// params传参
http.request('post', '/xxx', { params: param });

// data传参
http.request('post', '/xxx', { data: param });
```
