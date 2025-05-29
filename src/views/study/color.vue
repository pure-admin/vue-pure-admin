<script setup lang="ts">
defineOptions({
  name: "StudyColor"
});
</script>

<template>
  <div class="container">
    <h1>颜色</h1>
    <h2>黑色</h2>
    <div class="list">
      <div>------------------</div>
      <div>文字，主标题</div>
      <div class="item">
        <input type="color" class="box" value="black" />
        <div style="color: black">black</div>
      </div>
      <div class="item">
        <input type="color" class="box" value="#000000" />
        <div style="color: #000">#000000</div>
      </div>
      <div class="item">
        <input type="color" class="box" value="#333333" />
        <div style="color: #333">#333</div>
      </div>
      <div class="item">
        <input type="color" class="box" value="#444444" />
        <div style="color: #444">#444</div>
      </div>
    </div>
    <h2>灰色</h2>
    <div class="list">
      <div>------------------</div>
      <div>文字，副标题</div>
      <div class="item">
        <input type="color" class="box" value="#555555" />
        <div style="color: #555">#555</div>
      </div>
      <div class="item">
        <input type="color" class="box" value="#666666" />
        <div style="color: #666">#666</div>
      </div>
      <div class="item">
        <input type="color" class="box" value="#777777" />
        <div style="color: #777">#777</div>
      </div>
      <div class="item">
        <input type="color" class="box" value="#888888" />
        <div style="color: #888">#888</div>
      </div>
      <div class="item">
        <input type="color" class="box" value="#999999" />
        <div style="color: #999">#999</div>
      </div>
      <div>------------------</div>
      <div>不怎么用</div>
      <div class="item">
        <input type="color" class="box" value="#aaaaaa" />
        <div style="color: #aaa">#aaa</div>
      </div>
      <div class="item">
        <input type="color" class="box" value="#bbbbbb" />
        <div style="color: #bbb">#bbb</div>
      </div>
      <div class="item">
        <input type="color" class="box" value="#cccccc" />
        <div style="color: #ccc">#ccc</div>
      </div>
      <div>------------------</div>
      <div>border</div>
      <div class="item">
        <input type="color" class="box" value="#eeeeee" />
        <div style="color: #eee">#eee</div>
      </div>
      <div class="item">
        <input type="color" class="box" value="#e0e0e0" />
        <div style="color: #e0e0e0">#e0e0e0</div>
      </div>
      <div class="item">
        <input type="color" class="box" value="#e5e5e5" />
        <div style="color: #e5e5e5">#e5e5e5</div>
      </div>
      <div class="item">
        <input type="color" class="box" value="#f0f0f0" />
        <div style="color: #f0f0f0">#f0f0f0</div>
      </div>
      <div class="item">
        <input type="color" class="box" value="#f5f5f5" />
        <div style="color: #f5f5f5">#f5f5f5</div>
      </div>
      <div>------------------</div>
    </div>
    <h2>白色</h2>
    <div class="list">
      <div class="item">
        <input type="color" class="box" value="#ffffff" />
        <div style="color: #fff">#ffffff</div>
      </div>
    </div>
    <h2>红色</h2>
    <div class="list">
      <div class="item">
        <input type="color" class="box" value="#ff0000" />
        <div style="color: #f009">#ff 00 00</div>
      </div>
      <div class="item">
        <input type="color" class="box" value="#ee0000" />
        <div style="color: #e00">#ee0000</div>
      </div>
      <div class="item">
        <input type="color" class="box" value="#dd0000" />
        <div style="color: #d00">#dd0000</div>
      </div>
      <div class="item">
        <input type="color" class="box" value="#cc0000" />
        <div style="color: #e00">#cc0000</div>
      </div>
      <div class="item">
        <input type="color" class="box" value="#bb0000" />
        <div style="color: #b00">#bb0000</div>
      </div>
      <div class="item">
        <input type="color" class="box" value="#aa0000" />
        <div style="color: #a00">#aa0000</div>
      </div>
      <div class="item">
        <input type="color" class="box" value="#990000" />
        <div style="color: #900">#990000</div>
      </div>
      <div class="item">
        <input type="color" class="box" value="#550000" />
        <div style="color: #500">#550000</div>
      </div>
      <div class="item">
        <input type="color" class="box" value="#330000" />
        <div style="color: #300">#330000</div>
      </div>
    </div>
    <h2>绿色</h2>
    <div class="list">
      <div class="item">
        <input type="color" class="box" value="#00ff00" />
        <div style="color: #0f0">#00 ff 00</div>
      </div>
      <div class="item">
        <input type="color" class="box" value="#00ee00" />
        <div style="color: #0e0">#00ee00</div>
      </div>
      <div class="item">
        <input type="color" class="box" value="#00dd00" />
        <div style="color: #0d0">#00dd00</div>
      </div>
      <div class="item">
        <input type="color" class="box" value="#00cc00" />
        <div style="color: #0c0">#00cc00</div>
      </div>
      <div class="item">
        <input type="color" class="box" value="#00bb00" />
        <div style="color: #0b0">#00bb00</div>
      </div>
      <div class="item">
        <input type="color" class="box" value="#00aa00" />
        <div style="color: #0a0">#00aa00</div>
      </div>
      <div class="item">
        <input type="color" class="box" value="#009900" />
        <div style="color: #090">#009900</div>
      </div>
      <div class="item">
        <input type="color" class="box" value="#005500" />
        <div style="color: #050">#005500</div>
      </div>
      <div class="item">
        <input type="color" class="box" value="#003300" />
        <div style="color: #030">#003300</div>
      </div>
    </div>
    <h2>蓝色</h2>
    <div class="list">
      <div class="item">
        <input type="color" class="box" value="#0000ff" />
        <div style="color: #00f">#0000ff</div>
      </div>
      <div class="item">
        <input type="color" class="box" value="#0000ee" />
        <div style="color: #00e">#0000ee</div>
      </div>
      <div class="item">
        <input type="color" class="box" value="#0000dd" />
        <div style="color: #00d">#0000dd</div>
      </div>
      <div class="item">
        <input type="color" class="box" value="#0000cc" />
        <div style="color: #00c">#0000cc</div>
      </div>
      <div class="item">
        <input type="color" class="box" value="#0000bb" />
        <div style="color: #00b">#0000bb</div>
      </div>
      <div class="item">
        <input type="color" class="box" value="#0000aa" />
        <div style="color: #00a">#0000aa</div>
      </div>
      <div class="item">
        <input type="color" class="box" value="#000099" />
        <div style="color: #009">#000099</div>
      </div>
      <div class="item">
        <input type="color" class="box" value="#000055" />
        <div style="color: #005">#000055</div>
      </div>
      <div class="item">
        <input type="color" class="box" value="#000033" />
        <div style="color: #003">#000033</div>
      </div>
    </div>
    <h2>RGB</h2>
    <div class="list">
      <div class="item">
        <input type="color" class="box" value="rgb(0,0,0)" />
        <div style="color: rgb(0 0 0)">rgb(0,0,0)</div>
      </div>
      <div class="item">
        <input type="color" class="box" value="#ff0000" />
        <div style="color: rgb(255 0 0 / 50%)">rgba(255,0,0,0.5)</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 900px;
  padding: 0 16px 16px;
  margin: 0 auto;
  border: 1px solid #e5e5e5;
}

.border {
  border-bottom: 1px solid #e5e5e5;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.item {
  display: flex;
  gap: 5px;
  font-size: 20px;
}

.box {
  width: 20px;
  height: 20px;
  padding: 0;
  border: 1px solid #e5e5e5;
  border-radius: 2px;
}
</style>
