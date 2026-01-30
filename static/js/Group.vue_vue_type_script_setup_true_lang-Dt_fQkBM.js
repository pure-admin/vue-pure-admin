import"./deepChat-BEyU0r4q.js";import{d as o,m as r,b as a,j as p,l as s}from"./index-ChQ6eMdI.js";const l=o({__name:"Group",setup(n){const e=s();return r(()=>{e.value.demo={response:t=>({text:"仅演示，如需AI服务，请参考 https://deepchat.dev/docs/connect"})}}),(t,m)=>(a(),p("deep-chat",{ref_key:"chatRef",ref:e,auxiliaryStyle:`
    .deep-chat-top-message .message-bubble {
        border-top-left-radius: 5px !important;
        border-top-right-radius: 5px !important;
    }
    .deep-chat-middle-message .message-bubble {
        margin-top: 0px;
    }
    .deep-chat-bottom-message .message-bubble {
        margin-top: 0px;
        border-bottom-left-radius: 5px !important;
        border-bottom-right-radius: 5px !important;
    }
    .deep-chat-top-message.deep-chat-bottom-message .message-bubble {
      margin-top: 10px;
    }`,messageStyles:{default:{shared:{bubble:{borderRadius:"0px"}}}},textInput:{placeholder:{text:"发送消息"}},history:[{text:"组1",role:"group1"},{text:"组2-1",role:"group2"},{text:"组2-2",role:"group2"},{text:"组2-3",role:"group2"},{text:"组3-1",role:"group3"},{text:"组3-2",role:"group3"}],demo:!0},null,512))}});export{l as _};
