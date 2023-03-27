import axios from "axios";
import React, { useState } from "react";

// önerilen başlangıç stateleri
const initialMessage = "";
const initialEmail = "";
const initialSteps = 0;
const initialBoard = [null, null, null, null, "B", null, null, null, null];

export default function AppFunctional(props) {
  // AŞAĞIDAKİ HELPERLAR SADECE ÖNERİDİR.
  // Bunları silip kendi mantığınızla sıfırdan geliştirebilirsiniz.
  const [board, setBoard] = useState(initialBoard);
  const [steps, setSteps] = useState(initialSteps);
  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);

  let activeIdx = board.indexOf("B");
  let [x, y] = getXY();

  function getXY() {
    let X = (activeIdx % 3) + 1;
    let Y = Math.floor(activeIdx / 3 + 1);
    return [X, Y];
    // Koordinatları izlemek için bir state e sahip olmak gerekli değildir.
    // Bunları hesaplayabilmek için "B" nin hangi indexte olduğunu bilmek yeterlidir.
  }
  console.log(getXY());

  function getXYMesaj() {
    // Kullanıcı için "Koordinatlar (2, 2)" mesajını izlemek için bir state'in olması gerekli değildir.
    // Koordinatları almak için yukarıdaki "getXY" helperını ve ardından "getXYMesaj"ı kullanabilirsiniz.
    // tamamen oluşturulmuş stringi döndürür.

    return `Koordinatlar (${x}, ${y})`;
  }
  console.log(getXYMesaj());

  function reset() {
    // Tüm stateleri başlangıc ​değerlerine sıfırlamak için bu helperı kullanın.
    setBoard(initialBoard);
    setSteps(initialSteps);
    setMessage(initialMessage);
    setEmail(initialEmail);
  }

  function sonrakiIndex(yon) {
    // Bu helper bir yön ("sol", "yukarı", vb.) alır ve "B" nin bir sonraki indeksinin ne olduğunu hesaplar.
    // Gridin kenarına ulaşıldığında başka gidecek yer olmadığı için,
    // şu anki indeksi değiştirmemeli.
    let nextIdx = null;
    if ((yon === "left") & (activeIdx % 3 !== 0)) {
      nextIdx = activeIdx - 1;
    } else if ((yon === "right") & (activeIdx % 3 !== 2)) {
      nextIdx = activeIdx + 1;
    } else if ((yon === "up") & (activeIdx > 2)) {
      nextIdx = activeIdx - 3;
    } else if ((yon === "down") & (activeIdx < 6)) {
      nextIdx = activeIdx + 3;
    } else {
      nextIdx = activeIdx;
    }
    return nextIdx;
  }

  function ilerle(evt) {
    let yon = evt.target.id;
    let nextIdx = sonrakiIndex(yon);
    if (nextIdx !== activeIdx) {
      let newBoard = board.map((i, idx) => (idx === nextIdx ? "B" : null));
      setBoard(newBoard);
      setSteps((steps) => steps + 1);
      setMessage(initialMessage);
    }
    if (nextIdx === activeIdx) {
      setMessage(`You can't go ${yon}`);
    }
    // Bu event handler, "B" için yeni bir dizin elde etmek üzere yukarıdaki yardımcıyı kullanabilir,
    // ve buna göre state i değiştirir.
  }
  console.log(board);

  function onChange(evt) {
    const { value } = evt.target;
    setEmail(value);
    // inputun değerini güncellemek için bunu kullanabilirsiniz
  }

  function onSubmit(evt) {
    evt.preventDefault();
    axios
      .post("http://localhost:9000/api/result", {
        x: x,
        y: y,
        email: email,
        steps: steps,
      })
      .then((res) => setMessage(res.data.message))
      .catch((err) => setMessage(err.response.data.message))
      .finally(() => {
        setEmail(initialEmail);
      });
    // payloadu POST etmek için bir submit handlera da ihtiyacınız var.
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMesaj()}</h3>
        <h3 id="steps">{steps} kere ilerlediniz</h3>
      </div>
      <div id="grid">
        {board.map((idx, index) => (
          <div key={index} className={`square${idx === "B" ? " active" : ""}`}>
            {idx === "B" ? "B" : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button onClick={(e) => ilerle(e)} id="left">
          SOL
        </button>
        <button onClick={(e) => ilerle(e)} id="up">
          YUKARI
        </button>
        <button onClick={(e) => ilerle(e)} id="right">
          SAĞ
        </button>
        <button onClick={(e) => ilerle(e)} id="down">
          AŞAĞI
        </button>
        <button onClick={() => reset()} id="reset">
          reset
        </button>
      </div>
      <form onSubmit={(e) => onSubmit(e)}>
        <input
          id="email"
          onChange={(e) => onChange(e)}
          value={email}
          type="email"
          placeholder="email girin"
        ></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  );
}
