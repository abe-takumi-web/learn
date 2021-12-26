export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["top_200_password_2020_by_country.csv",new URL("./files/1b6665d320b28f348e3524465d2c6eadc84d46529b2e9d8cc6be5cf4d4843aba50cc9e5e12dd0821d8d06b7a15410edb204d0f24ff5d658a628f9a70bd337ef1",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# 各国の上位２００のパスワード`
)});
  main.variable(observer("data")).define("data", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("top_200_password_2020_by_country.csv").csv()
)});
  main.variable(observer()).define(["data"], function(data){return(
data
)});
  main.variable(observer("viewof table")).define("viewof table", ["Inputs","data"], function(Inputs,data){return(
Inputs.table(data,{})
)});
  main.variable(observer("table")).define("table", ["Generators", "viewof table"], (G, _) => G.input(_));
  main.variable(observer("data2000")).define("data2000", ["data"], function(data){return(
data.filter(d => d.Global_rank <= 10)
)});
  main.variable(observer("data1000")).define("data1000", ["data"], function(data){return(
data.filter(d => d.Rank <= 30)
)});
  main.variable(observer("data3000")).define("data3000", ["data"], function(data){return(
data.filter(d => d.Password <=30)
)});
  main.variable(observer()).define(["vl","data"], function(vl,data){return(
vl.markBar({ filled: true })
  .data(data)
  .encode(
    vl.y().fieldQ('User_count').title('User_count'),
    vl.x().fieldQ('Global_rank').title('ランク').scale({ domain: [0, 200] }),
    vl.color().fieldN('Password')
  )
  .render()
)});
  main.variable(observer()).define(["md"], function(md){return(
md`
これだと見にくいので、ランクを１０位以内にします。
`
)});
  main.variable(observer()).define(["vl","data2000"], function(vl,data2000){return(
vl.markBar({ filled: true })
  .data(data2000)
  .encode(
    vl.y().fieldQ('User_count').title('ユーザー数'),
    vl.x().fieldQ('Global_rank').title('グローバルランク').scale({domain:[1,10]}),
    vl.color().fieldN('Password'),
    vl.opacity().value(15),
    vl.tooltip(['Password']) 
  )
  .render()
)});
  main.variable(observer()).define(["md"], function(md){return(
md`
グローバルランキングなのでユーザー数の多い順になると思いきや変なグラフになってしまいました。
何故だろうと考えた結果、このデータセットは、
国ごとのパスワードランキングとグローバルランキングが混合した結果、
どこかの国のユーザー数が表示されたということになります。

一応ランキングの順位とパスワードは変わりはないと思います。
`
)});
  main.variable(observer("genres")).define("genres", function(){return(
['United States', 'Japan','Germany', 'United Kingdom', 'France','Italy', 'Canada', 'Netherlands', 'Belgium', 'Luxembourg', 'Switzerland', 'Austria', 'Sweden', 'Denmark', 'Norway', 'Finland', 'Iceland', 'Ireland', 'Spain', 'Portugal', 'Australia', 'New Zealand', 'Israel', 'South Korea', 'Taiwan' ,'China','Singapore','Russia']
)});
  main.variable(observer()).define(["vl","genres","data1000"], function(vl,genres,data1000)
{
  const selection = vl.selectPoint('Select')
    .fields('country')
    .init({
      'country': 'Russia',
    })
    .bind({
      'country': vl.menu(genres),
    })
    return vl.markBar({ filled:true})
      .data(data1000)
      .params(selection)
  .encode(
     vl.y().fieldQ('User_count').title('User_count'),
    vl.x().fieldQ('Rank').title('ランク').scale({ domain: [0, 30] }),
    vl.opacity().if(selection,vl.value(0.75)).value(0.05),
    vl.tooltip().fieldN('Password')
  )
  .render()
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`
先進国ごとでユーザー数を可視化してみたところ、異常にロシアがユーザー数が多いことがわかった。
ただ単に人口が多いだけなのかそれだとしたら中国やアメリカなどが負けているはずがない。
ロシアはスパイ大国として有名なので、pcを大量に使っているという説を推して行きたい。

ということはさっきのグローバルランキングのユーザー数はロシアの数が異常すぎておかしくなっていただけなのかもしれない。
`
)});
  main.variable(observer()).define(["vl","data"], function(vl,data){return(
vl.markPoint({ filled: true })
  .data(data)
  .encode(
    vl.x().fieldQ('Rank').title('ランキング'),
    vl.y().fieldN('country').title('クラックにかかる時間'),
    vl.size().fieldQ('Time_to_crack_in_seconds').scale({ range: [0, 1000] }).title('１秒間にクラックされる回数'),
    vl.tooltip(['Password','Time_to_crack_in_seconds','Time_to_crack']),
    vl.order().fieldQ('Time_to_crack_in_seconds').sort('descending')
  )
  .render()
)});
  main.variable(observer()).define(["md"], function(md){return(
md`
これは円が大きいほど安全ってことですね。

日本やアメリカ、韓国やイギリス、ドイツにフランスなど、先進国はだいぶパスワードが軽視されている傾向があるということです。

複雑なパスワードだと、攻撃を受けても、１世紀も持つことがわかりました。
ブラジルやインドネシアなどがパスワードをちゃんと重要化しているようですね。


　
`
)});
  main.variable(observer()).define(["md"], function(md){return(
md `







まとめ
`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`

今回は逆に膨大すぎるデータ量に困らされた結果となってしまった。
個人的にはアメリカと中国のパスワードのユーザー数は人工的に納得できる範囲なのだが、ロシアが異常に多いので、そこはとても気になる点であった。

世界的に数字の配列がトップ常連だった。passwordとqwertyも人気だった。
qwertyってなんだろうなと調べたら、キーボードの並び順に押しただけのやつだそうです。

残念なことに我が国日本のランキング３０位以内に、princess,I love you, dragon, fuck you
などがあった。心当たりがある人も少なくないのではないだろうか。

かなり面白い結果になったので、またの機会に、個人的に調べてみようと思う。
`
)});
  return main;
}
