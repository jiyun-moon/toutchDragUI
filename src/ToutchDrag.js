import React, { useState, useEffect } from "react";
import "./style.css";
// import _ from "lodash";

const ToutchDrag = () => {
  const [boxes, setboxes] = useState([]);
  useEffect(() => {
    setboxes([
      { newIndex: 1, txt: "A", color: "#0f94c4" },
      { newIndex: 2, txt: "B", color: "#722a8d" },
      { newIndex: 3, txt: "C", color: "#846cb6" },
      { newIndex: 4, txt: "D", color: "#d0d0d0" },
      { newIndex: 5, txt: "E", color: "#006497" },
      { newIndex: 6, txt: "F", color: "#f5d564" },
      { newIndex: 7, txt: "G", color: "#ff7879" },
    ]);
  }, []);

  let dragged = ""; // 선택된 녀석
  let over = ""; // 옮길 곳의 녀석
  let keeper = document.createElement("LI"); // 선택된 녀석의 빈자리 채워줄 녀석

  const dragStart = (e, txt) => {
    const touch = e.touches[0];
    dragged = touch.target;

    // 터치된 녀석의 자리를 채워줄 녀석을 생성해준다.
    keeper.classList.add("keeper");
    keeper.innerText = txt;
  };

  const dragOver = (e) => {
    // 노드를 선택하고 스타일을 입힌다.
    dragged.parentElement.insertBefore(keeper, dragged);
    dragged.classList.add("drag-up");
    // ul의 자식들만 옮겨놓을 수 있도록 설정

    // targetTouches 등에 대한 설명은 https://d2.naver.com/helloworld/80243 참고
    // 손가락 하나만 쓰도록 할거기 때문에 [0]를 찍어준다.

    // 손가락이 닿은채로 움직일때 x,y좌표를 구해서 터치된 놈의 x,y 포지션을 이동시킨다.
    let touch = e.targetTouches[0],
      elementFromPoint = document.elementFromPoint(
        touch.pageX - window.pageXOffset,
        touch.pageY - window.pageYOffset
      );
    dragged.style.left = touch.pageX + "px";
    dragged.style.top = touch.pageY + "px";

    if (e.target.nodeName !== "LI" || !elementFromPoint.dataset.item) {
      return;
    }

    console.log("elementFromPoint", elementFromPoint, dragged.dataset);

    const dgIndex = JSON.parse(dragged.dataset.item).newIndex;
    const taIndex = JSON.parse(elementFromPoint.dataset.item).newIndex;
    const animateName = dgIndex > taIndex ? "drag-up" : "drag-down";

    if (over && elementFromPoint.dataset.item !== over.dataset.item) {
      over.classList.remove("drag-down");
      console.log("when comming here?");
    }
    if (!elementFromPoint.classList.contains(animateName)) {
      elementFromPoint.classList.add("drag-down");
      over = elementFromPoint;
    }
  };

  const dragEnd = (e) => {
    // 움직이고 있는 녀석의 좌표
    const moveX = parseInt(dragged.style.left);
    const moveY = parseInt(dragged.style.top);
    // 움직이기전의 원래 좌표
    const baseX = parseInt(keeper.offsetTop);
    const baseY = parseInt(keeper.offsetLeft);

    console.log("over", over);

    if (!over) {
      console.log("여긴가?", baseX, baseY);
      dragged.classList.remove("drag-up");
      dragged.classList.add("animatable");
      keeper.parentNode.removeChild(keeper);
      dragged.style.left = baseX;
      dragged.style.top = baseY;
      setTimeout(() => {
        dragged.style.removeProperty("left");
        dragged.style.removeProperty("top");
        dragged.classList.remove("animatable");
      }, 200);
      return;
    }

    // Adds animatable class
    if (!dragged.classList.contains("animatable")) {
      dragged.classList.add("animatable");
    }

    e.target.classList.remove("drag-up");
    over.classList.remove("drag-up");

    e.target.classList.remove("drag-down");
    over.classList.remove("drag-down");

    keeper.parentNode.removeChild(keeper);

    let data = boxes;
    let from = Number(dragged.dataset.id);
    let to = Number(over.dataset.id);

    const changeBox = (list, fromIdx, toIdx) => {
      [data[fromIdx], data[toIdx]] = [data[toIdx], data[fromIdx]];
      return data;
    };

    changeBox(data, from, to);

    // set newIndex to judge direction of drag and drop
    data = data.map((doc, index) => {
      doc.newIndex = index + 1;
      return doc;
    });

    setboxes(data);

    setTimeout(() => {
      dragged.style.removeProperty("left");
      dragged.style.removeProperty("top");
      dragged.classList.remove("animatable");
    }, 200);
  };

  return (
    <div className="wrap">
      <h1>Touch move Event example</h1>
      <p>- drag and change(only mobile)</p>
      <ul onTouchMove={(e) => dragOver(e)}>
        {boxes.map((box, idx) => {
          return (
            <li
              key={idx}
              data-id={idx}
              data-item={JSON.stringify(box)}
              draggable={boxes.length > 0 && true}
              onTouchStart={(e) => dragStart(e, box.txt)}
              onTouchEnd={(e) => dragEnd(e)}
              style={{
                background: box.color,
              }}
            >
              {box.txt}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ToutchDrag;
