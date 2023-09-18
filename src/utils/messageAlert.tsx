import { createApp } from "vue";
import { styled } from "@styils/vue";
const msgBoxDiv = styled("div", {
  position: "fixed",
  width: "260px",
  height: "40px",
  backgroundColor: "#fff",
  top: "4vh",
  left: "50%",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  borderRadius: "6px",
  transform: "translateX(-50%)"
});
const tipsDiv = styled("div", {
  height: "100%",
  display: "flex",
  alignItems: "center"
});
const itemSpan = styled("span", {
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center"
});

/**
 * Represents a person.
 * @typedef {Object} messageApi
 * @property {string} success - 这个是成功提示
 * @property {string} info - 这个是绿色提示
 * @property {string} error - 这个是错误红色提示
 * @property {string} waring - 这个是黄色提示
 */
const messageApi = {
  success(msg: string, type = "success") {
    const messageDiv = document.createElement("div");
    document.body.appendChild(messageDiv);

    const messageBox = {
      props: {
        content: {
          type: String,
          default: "取消了"
        },
        type: {
          type: String,
          default: "success"
        }
      },
      created() {
        // console.log("创建成功");//2秒后销毁
        setTimeout(() => {
          document.body.removeChild(messageDiv);
        }, 1500);
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
      setup(_: any, { emit }: any) {
        return {};
      },
      render(ctx: { $props: any; $emit: any }) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
        const { $props, $emit } = ctx;
        return (
          <>
            <msgBoxDiv>
              <tipsDiv>
                {$props.type === "success" && (
                  <itemSpan>
                    <img
                      style="width:20px;height:20px;margin-left: 10px;margin-right: 6px;"
                      src="data:image/gif;base64,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"
                      alt=""
                    />
                    {$props.content}
                  </itemSpan>
                )}
              </tipsDiv>
            </msgBoxDiv>
          </>
        );
      }
    };

    const app = createApp(messageBox, {
      content: msg,
      type: type
    });
    app.mount(messageDiv);
  },
  info(msg: string, type = "info") {
    const messageDiv = document.createElement("div");
    document.body.appendChild(messageDiv);

    const messageBox = {
      props: {
        content: {
          type: String,
          default: "取消了"
        },
        type: {
          type: String,
          default: "success"
        }
      },
      created() {
        // console.log("创建成功");//2秒后销毁
        setTimeout(() => {
          document.body.removeChild(messageDiv);
        }, 1500);
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
      setup(_: any, { emit }: any) {
        return {};
      },
      render(ctx: { $props: any; $emit: any }) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
        const { $props, $emit } = ctx;
        return (
          <>
            <msgBoxDiv>
              <tipsDiv>
                {$props.type === "info" && (
                  <itemSpan>
                    <img
                      style="width:20px;height:20px;margin-left: 10px;margin-right: 6px;"
                      src="data:image/gif;base64,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"
                      alt=""
                    />
                    {$props.content}
                  </itemSpan>
                )}
              </tipsDiv>
            </msgBoxDiv>
          </>
        );
      }
    };

    const app = createApp(messageBox, {
      content: msg,
      type: type
    });
    app.mount(messageDiv);
  },
  error(msg: string, type = "error") {
    const messageDiv = document.createElement("div");
    document.body.appendChild(messageDiv);

    const messageBox = {
      props: {
        content: {
          type: String,
          default: "取消了"
        },
        type: {
          type: String,
          default: "success"
        }
      },
      created() {
        // console.log("创建成功");//2秒后销毁
        setTimeout(() => {
          document.body.removeChild(messageDiv);
        }, 1500);
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
      setup(_: any, { emit }: any) {
        return {};
      },
      render(ctx: { $props: any; $emit: any }) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
        const { $props, $emit } = ctx;
        return (
          <>
            <msgBoxDiv>
              <tipsDiv>
                {$props.type === "error" && (
                  <itemSpan>
                    <img
                      style="width:20px;height:20px;margin-left: 10px;margin-right: 6px;"
                      src="data:image/gif;base64,
                                iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAAFARJREFUeF7tnWuMHNWVx/+nm6n2oliYxGaRzFTHk+CutiVjKwqrxCG7q6zsL7BeMOsIQhITklUeX5bE7BL4gPkAYddO2C95aAN48gLFYNgJfMFKtLshDy1WFINkd7UJ43R1LHmxCbYSse4aus+q2jNkMDPTXdX3Vt1bdVqyLKvvPfec/zk/16PvgyAfUUAUWFQBEm1EAVFgcQUEEKkOUWAJBQQQKQ9RQACRGhAFkikgV5BkukmvgigggBQk0RJmMgUEkGS6Sa+CKCCAFCTREmYyBQSQZLpJr4IoIIAUJNESZjIFBJBkukmvgigggBQk0RJmMgUEkGS6Sa+CKCCAFCTREmYyBQSQZLpJr4IoIIAUJNESZjIFBJBkukmvgigggBQk0RJmMgUEkGS6xerVWF1ZSyV4IPbAWAWiFQBfAiD6syL6m8ErCBT9Gww+S6AzAM4CmP2bzoL5DAinwORzD379ROdYLEekcWwFBJDYki3eobl67KpuGVeViWroRUDAY8ADUFI4zHxTPQJ8MHyU4HeZm+UuXqidmHlB03iFMyuAjJDyl1xnXZf4A9yjjxD4b0C0agRz6royn2LQj6nEPykz/fLKIDyqznixLAkgMfJ9zF020aPuX6NX+gDA14CwNkb37JoyjgH0HEq9X5a4/J9rg3PT2Tlj18gCyIB8+SuxHBc72wBsY2AbAWN2pfit3jIwQ8AUoj+vh1PeafzB5nh0+y6ALKJwY7yyhUrYBuYIjtW6E5GR/RMgmuIepurtzsGMfDB6WAFkXnqm1yyrdrq9WwmIoNhodObUO3eYgalKubRv4vi5lnrzdloUQAD4VzgbqMw7mWkngEvtTKUyr18j4knu0qT3u/BFZVYtNVRoQJrjF13DKO0EIQJD16tYS0sDPTAmCb3JWvuN52wNYlS/CwlIw61cS+AIiu2jCliQ/gcYNFkPOs8UJN43wywUIEdcZ12ZsAuMW4uWaCXxEvZ1GXvXF+h3lUIAwu/DmP+KcwcR7pid2qGkXgpq5Awz9niXhXvoV5jJuwa5B8R3nR0AdgF4f96TmXJ8hwDs9YJwf8rjpjpcbgGJ3kwx4U4i3JSqogUbjBmPEeOBvL7xyiUgftX5GBh7AVxesHrNKtyTIOzyWuEPsnJA17i5A6ThOl8h4E5dgondxRVg4IF6EH45TxrlBhB/TaVGXd7LwLV5SpBtsRDwDJdpl3e807TN94X8zQUgjaqzHYyvElDNQ1Jsj4GBFghfqrfCA7bHYj0gDdfZTcA9ticij/4zcG89CHfbHJvVgPhu5ZsAf9bmBOTfd/qWF3Q+Z2uc1gLSGHeeJML1tgpfJL+Z8VS9Hd5gY8xWAuK7zs8BfNBGwQvs8y+8INxsW/zWAdJ0nd8w8B7bhBZ/AQJergXhe23SwipAfNeJloe+wyaBxde3KfBHLwiX26KLNYD4rvMqgHfaIqz4uaQCv/eC8F02aGQFIL7rPC+TDW0op1g+HvKC8OpYPTJobDwgzarzKLNMOMygNrQPSYTHaq3wZu0DjTCA0YA0q2NfY6bbR4hPuhquABE/WGvNfNFUN40FRCYdmloy6v0yeZKjkYDI9BH1RWi6RVOnpRgHSDTxkBhPmJ5Q8U+9Aky40bQJjkYBEk1Z5y4/K7Ny1RefDRajWcBUpq0mTZU3CpCm6zwt6zlsKGV9PkbrSWpBeJ2+EeJZNgYQeSiPl7g8tzbpod0IQGbXkH8/z0mX2GIqQLjFhDXumQMS7T6CEp6VDRZiFlD+m59ED1uz3i0lc0Aa486jsjVP/qs9SYTRlkL1dra/tGcKyOymbj9MIp70KYwCH81yc7rMAIm2A22e6i98kh0PC1PriQI9VFsVbs5qm9PMAGmMO3cR4b5EkkmnQinAjLvr7fD+LILOBJD+LutAdPWIzgiXjygwSIEzXWBzFrvKZwKIX3UekSMIBtWEfP8WBQj7vFb4qbRVSR2Q2cNrnk47UBnPfgUYdF3ah/ikDojvOtFERDnZyf56zSKCA14Q3pjmwKkC0j8TkEo/TTNAGStfChD3PpzmmYmpAuKPOw+DkPp9pIoSIeAIA+tV2MrahtWxMB7x2uFtaWmYGiCzU0p+beNpslFBlYAdbwA7bN8HOFqYdBGwvwfstxT4HnrYlNYUlNQAsXV9+RwcV84eXGnzasf5q/Zecp11tkKS5jr2VACZXrOsGnZ70dXj0rQujSrGuRCOOZs2QrLQklaLIXnNKZc2TRw/11KR56VspAKIjQW1GBw2QrLUem9bIUlrDXsqgPiuE109NuqmXZX9QXDYBMkwhWQpJIe9INykKueL2dEOSGO8soWIo/UeVnyGhcMGSIaBYy4OGyFhpq31duegzsLSDohfrXwdzJ/XGYQq23HhMBmSOHBYCwnRN7xW5wuq8r+QHa2A+CuxHBc7DQCrdQahwnZSOEyEJAkclkJyAq+Hde80ol3/tXz0AuI6twD4nhbPFRodFQ6TIBkFDksh+bgXhNr2M9ANyOMAUp07E5cbVXCYAIkKOCyE5AkvCP8+bt6Hba8NkGPusokuej4BY8M6k1U7lYUVxZDFa+08xJAk/wzMlFHy1gbnppP0H9RHGyBNd+wzDPr3QQ6Y8r3NBWaz7yryT+B/qAUz31Zh60IbGgFxvsPAJ3Q4rcumjYVmo8+q80fAd2tB+EnVdiN72gDxXedlABM6nNZp06aCs8lXnTkDMO0FoZaDXbUAcuTdYxvLPYp+PbfyY0Ph2eBjmsnvlnjT+t/OHFY9phZAjrqVfyyBH1TtbJr2TC5Ak31LM0fzx+qBbl8XdP5N9fhaAPGrzlNg/J1qZ9O2Z2IhmuhT2nlZcDzCf3it8HrVvugBxHVOA7DimN9BgppUkCb5Mki3DL5/1QvClarHVQ6I7c8fCwlsQmGa4IPq4lNtT8dziHJAjrpjnyiBvqM6+KztZVmgWY6dte5xxu+BP7kumPlunD6D2ioHpFl17mPGXYMGtvH7LAo1izFtzE3kMxHur7XCu1X6rx6QcecAE25Q6aRJttIs2DTHMknjpL4Q48laO1S655p6QFwn2h5nXdIgbeiXRuGmMYYNWsfxkYCjtSBUujWTckB81+nauLVPnEREbXUWsE7bceO0rH3PC8KySp+VAtJYXVlLZW6qdNBkWzoKOYq3HoS7VcWdxcxiVb4nscNdqtVPdI4l6btQH6WA+OOVvwXxlCrnbLCjGhKVMRcNjr52TNu8dudHqnRUC4jr/BOAf1HlnC12TISkkHCcL5h/9oLwX1XVjlpAxp09IOxS5ZxNdkyCpMBwRA+He712eIeq2lELiFv5NsCfVuWcbXZMgKTQcPQLhh7ygs5nVNWOYkCc/QC0rQ9WFbROO1lCInD0M/u4F4Q7VOVYNSDRBnFbVDlnq50sIBE43qyWg14QblVVO6oB+R8AV6tyzmY7aUIicLylUp73gvAvVNWOakB8ADVVztluJw1IBI63VUnTC0JPVe0oBaThjp0k0J+rci4PdnRCInC8vUIY/L/1YOZyVbWjFBDfdf4PwDJVzuXFjg5IBI5Fq+OcF4R/pqp2BBBVSi5hRwBJQeQ/DWEuIHKLtdAlH/eqnFs1fwS5ith3iyUP6fNypuPKcWFJCCQWPaT7riOveWfzlQYcc6UhkNjzmld+KNSwVmSYO3iBxI4fCmWqCfQ9cwwCRSDpK2TyVBOZrKjrgXwQHHK7NaeAyZMVZbq7spWAwwKxULtCX0nMnu4uC6ZGKWyVfQsMickLpmTJrcoiH9VWISExecmtbNowWklHBR1ZUPkcUzRIjN60IUqubPuTDJL5haz6N5QCQWL2tj9RaTRl47jYhCxUwAJJbBmj49LM3ziumfOtRwnYXQvCe+Onb+EeS/3vLpDEU9mOrUdzvHl1mnDMlYZAMjwkVmxendfjD7KAQyAZHo6opR3HH6weu4rLpPwwxXhSqW2dJRwCyfC5pC5vrJ2YeWH4HoNbKl0wNTecPz72CohWDR7e/BYmwCGQDFEnzKe89sxlQ7SM1UQLII1x51Ei3BTLEwMbmwSHQLJ0gTDjsXo7vFl1GWkBxK+O3Qamh1Q7m6Y9E+EQSJaoAOJPe62Zh1XXiBZAXnKddV3giGpn07JnMhwCycJVUAbWXxmER1XXiBZAIif9cacJwlrVDuu2ZwMcAskFVcA45rVDLfuxaQSk8hCIb9Nd0Crt2wSHQDIv80wPe+2Olk3T9QFi2XOIajiarnMPA6msD1Htu3VztzQ9f0QIagPkmLtsooueT8CYyv/lddhS/Wt1mnDM6VFUSBiYKaPkrQ3OTeuoDW2A9J9DXOdxADfqcFyVTQKOlIAdqh7wsoBDByTRi5YesJ8BpafGqsrbPDtPeEGo7cgN3YDcAuB7GkRRalIVJFnCoRISi+CIwv64F4TfV1oQ84zpBWQlluNipwFgta4AVNkdFRIT4FABiWVwnMDrYd07jT+oqoML7WgFpH+bVa18Hcyf1xWASrtJITEJjlEgsQwOgOgbXqvzBZU1kDogjfHKFiKONpSz4hMXEhPhSAKJdXBEG/Qxba23Owd1Fpb2K8jsw/qvAWzUGYhK28NCYjIccSCxEQ4Ah70g3KQy7wvZSgUQ696rn3//veTbLRvgGAYSS+GA6lfzi4GWCiDTa5ZVw24vuopcqpt4lfYXg8QmOJaCxFY4ALzmlEubJo6fa6nMd2ZXkGjgZnXsa8x0u+6AVNu/EBIb4VgIEovhABE/WGvNfFF1rjMFxL/C2YASoqtIKY3AVI4xB8kbwA4C7lFpO21b0a3JRcB+S34EXEieHnrY5P0ufDEN7VK5xZoLxB93HgbhU2kEpnqMCBILflUeKmyrY2E84rXD1CbBpgpIc/yia5hKPx0qi9JIFFhAAeLeh2vtN55LS5xUAYmC8l3nCQDb0wpQxsmVAge8IEx1bl/qgDTcyrUEfjpXaZNgUlGAQdfVg84zqQw2O0jqgPSvIlXnETBuTTNQGctyBQj7vFaY+vNrJoAccZ11ZeDnAFZYnjZxPx0FznSBzes1rDkf5H4mgERONcadu4hw3yAH5XtRgBl319vh/VkokRkg/D6MNU850VXk/VkELmNao8Ch2qpwM/0KM1l4nBkgs2+0dgD4YRaBy5jWKPBRLwij05Mz+WQKyOytVi52YcwkezkfVNduiXFkyxyQ2Sko0XqRy+M4Lm1zr8BJ9LA1rSkli6mZOSD9W62q8zEwtK0rzn0p5TFAwi1eK/xB1qEZAUj/Vst1vkLAnVkLIuNnrwADD9SD8MvZe6JxX6wkwTVd52kGrk3SV/rkQwECnqkF4XWmRGPMFaR/q7WmUuMuP0tA1RSBxI/0FGCgRWXa6h3vNNMbdemRjAKkf6tVdbYTI5rQKJ+CKcCEG+ut8IBJYRsHyOzzyG7bFyaZlGQbfElrjXlcLYwEpH+75Va+CfBn4wYk7W1UgL7lBZ3Pmei5sYD0ryTjzpNEuN5E4cQnNQow46l6O7xBjTX1VowG5PyVpD9f64PqQxeLBijwCy8INxvgx6IuGA9I5HnTdX7DwHtMFlJ8i6cAAS/XgvC98Xql39oKQGavJNEGxe9IXyIZUYMCf/SCcLkGu8pNWgPILCSvAninchXEYJoK/N4LwnelOeAoY1kFyCwkz8saklFSnmnfQ14QXp2pBzEHtw6Q/jNJ1XmUGTfFjFWaZ6gAER6rtcKbM3Qh0dBWAnIeEju3Mk2UJcs7pblVqGqprAUkEkJmAKsuB/X2TJqZmyQ6qwGZhUSmpSTJfAp9TJ0+Eid06wHpQ1J1toPxVZkFHCf1+tpGs3JB+JJpEw+TRJwLQPpvt9ZUatTlvbKeJEkZqOsTrefgMu0yacr6KNHlBpA5EeS5ZJRyGK2v7c8bC0WfO0D6V5Pza9z3ykYQoxV8jN4nQdhlwhryGD4P1TSXgPQhucLZwIQ7ieT3kqEqIWGjaGseYjyQ9e4jCd0f2C23gMxF7rtOtDndLvn1fWAtxG1wCMDeLDd1i+twkva5ByQSJdrm1H/FuYMId8iG2UnK5C19zjBjj3dZuCer7UBHjiCGgUIAMqdHf1d5wi45eiFGhcxvStjXZezNYpf1hB6P3K1QgPzpTVf/EJ+dctLV0PVzgEGTaR9eM7R3GhsWEpA5PftnJqK0E4QIFutO39VYF5HpHhiThN5kmmcCao4ptvlCA/Lmg/wVzgYq805mikC5NLaK+erwGhFPcpcm8/pmKk66BJB5ak2vWVbtdHu3ErANwMY4Quag7WEGpirl0r6J4+daOYhHSQgCyCIyNsYrW6iEbWCOYFmtRG3zjJwA0RT3MFVvdw6a5172HgkgA3Lgr8RyXOxEkGxjYBsBY9mnLbkHDMwQMIXoz+vhlHca0Vp/+SyigAASozSOucsmGN2PAPQhBj4EYCJG9yybThPwM4B/Rij/ZG1wbjpLZ2waWwAZIVtH3j22kXqlvyoR/yUY1wAwZTOCV0F4rsf031zq/df6384cHiHMQncVQBSm/zww2FAmqqEHDwSPAU/jK+QeAT4YPkrwu8xNLuFFAUJdUgUQdVouaqmxurKWShEw7IGxCkQrAL4EQPQnOiv+EgavIFD0bzD4LIHOADgLYPZvOgvmMyCcApPPPfj1E51jKbhf6CEEkEKnX4IfpIAAMkgh+b7QCggghU6/BD9IAQFkkELyfaEVEEAKnX4JfpACAsggheT7QisggBQ6/RL8IAUEkEEKyfeFVkAAKXT6JfhBCggggxSS7wutgABS6PRL8IMUEEAGKSTfF1oBAaTQ6ZfgBykggAxSSL4vtAICSKHTL8EPUkAAGaSQfF9oBQSQQqdfgh+kgAAySCH5vtAKCCCFTr8EP0iB/wfK0qsyMNWhOQAAAABJRU5ErkJggg=="
                      alt=""
                    />
                    {$props.content}
                  </itemSpan>
                )}
              </tipsDiv>
            </msgBoxDiv>
          </>
        );
      }
    };

    const app = createApp(messageBox, {
      content: msg,
      type: type
    });
    app.mount(messageDiv);
  },
  waring(msg: string, type = "waring") {
    const messageDiv = document.createElement("div");
    document.body.appendChild(messageDiv);

    const messageBox = {
      props: {
        content: {
          type: String,
          default: "取消了"
        },
        type: {
          type: String,
          default: "success"
        }
      },
      created() {
        // console.log("创建成功");//2秒后销毁
        setTimeout(() => {
          document.body.removeChild(messageDiv);
        }, 1500);
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
      setup(_: any, { emit }: any) {
        return {};
      },
      render(ctx: { $props: any; $emit: any }) {
        console.log(ctx, "render上下文");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
        const { $props, $emit } = ctx;
        return (
          <>
            <msgBoxDiv>
              <tipsDiv>
                {$props.type === "waring" && (
                  <itemSpan>
                    <img
                      style="width:20px;height:20px;margin-left: 10px;margin-right: 6px;"
                      src="data:image/gif;base64,
                                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"
                      alt=""
                    />
                    {$props.content}
                  </itemSpan>
                )}
              </tipsDiv>
            </msgBoxDiv>
          </>
        );
      }
    };

    const app = createApp(messageBox, {
      content: msg,
      type: type
    });
    app.mount(messageDiv);
  }
};

export default messageApi;
