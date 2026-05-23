import{Nr as e,Oi as t,ei as n,fs as r,ri as i,zr as a}from"./index-DYLbQH3m.js";import"./deepChat-C_kQdJdk.js";var o=a({__name:`Group`,setup(r){let a=t();return n(()=>{a.value.demo={response:e=>({text:`仅演示，如需AI服务，请参考 https://deepchat.dev/docs/connect`})}}),(t,n)=>(i(),e(`deep-chat`,{ref_key:`chatRef`,ref:a,auxiliaryStyle:`
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
    }`,messageStyles:{default:{shared:{bubble:{borderRadius:`0px`}}}},textInput:{placeholder:{text:`发送消息`}},history:[{text:`组1`,role:`group1`},{text:`组2-1`,role:`group2`},{text:`组2-2`,role:`group2`},{text:`组2-3`,role:`group2`},{text:`组3-1`,role:`group3`},{text:`组3-2`,role:`group3`}],demo:!0},null,512))}}),s=r({default:()=>c}),c=o;export{s as n,c as t};