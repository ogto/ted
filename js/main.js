(() => {
    let yOffset = 0; // window.pageYOffset 대신 쓸 변수
    let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
    let currentScene = 0; // 현재 활성화된(눈 앞에 보고있는) 씬(scroll-section)
    let enterNewScene = false; // 새로운 scene이 시작된 순간 true
    let acc = 0.2;
    let delayedYOffset = 0;
    let rafId;
    let rafState;

    const sceneInfo = [
        {
            // 0
            type: "sticky",
            heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight: 0,
            obj: {
                container: document.querySelector("#scrollSec0"),
                messageA: document.querySelector("#scrollSec0 .main-message.a"),
                messageB: document.querySelector("#scrollSec0 .main-message.b"),
                messageC: document.querySelector("#scrollSec0 .main-message.c"),
                messageD: document.querySelector("#scrollSec0 .main-message.d"),
            },
            values: {
                canvas_opacity: [1, 0, { start: 0.9, end: 1 }],
                messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
                messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
                messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
                messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],
                messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
                messageB_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
                messageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
                messageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],
                messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
                messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
                messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
                messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
                messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
                messageB_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],
                messageC_translateY_out: [0, -20, { start: 0.65, end: 0.7 }],
                messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }],
            },
        },
        {
            // 1
            type: "normal",
            // heightNum: 5, // type normal에서는 필요 없음
            scrollHeight: 0,
            obj: {
                container: document.querySelector("#scrollSec1"),
                content: document.querySelector("#scrollSec1 .description"),
            },
        },
        {
            // 2
            type: "sticky",
            heightNum: 5,
            scrollHeight: 0,
            obj: {
                container: document.querySelector("#scrollSec2"),
                messageA: document.querySelector("#scrollSec2 .a"),
                messageB: document.querySelector("#scrollSec2 .b"),
                messageC: document.querySelector("#scrollSec2 .c"),
                pinB: document.querySelector("#scrollSec2 .b .pin"),
                pinC: document.querySelector("#scrollSec2 .c .pin"),
                canvas: document.querySelector(".image-blend-canvas"),
                context: document
                    .querySelector(".image-blend-canvas")
                    .getContext("2d"),
            },
            values: {
                imageSequence: [0, 959],
                canvas_opacity_in: [0, 1, { start: 0, end: 0.1 }],
                canvas_opacity_out: [1, 0, { start: 0.95, end: 1 }],
                messageA_translateY_in: [20, 0, { start: 0.15, end: 0.2 }],
                messageB_translateY_in: [30, 0, { start: 0.5, end: 0.55 }],
                messageC_translateY_in: [30, 0, { start: 0.72, end: 0.77 }],
                messageA_opacity_in: [0, 1, { start: 0.15, end: 0.2 }],
                messageB_opacity_in: [0, 1, { start: 0.5, end: 0.55 }],
                messageC_opacity_in: [0, 1, { start: 0.72, end: 0.77 }],
                messageA_translateY_out: [0, -20, { start: 0.3, end: 0.35 }],
                messageB_translateY_out: [0, -20, { start: 0.58, end: 0.63 }],
                messageC_translateY_out: [0, -20, { start: 0.85, end: 0.9 }],
                messageA_opacity_out: [1, 0, { start: 0.3, end: 0.35 }],
                messageB_opacity_out: [1, 0, { start: 0.58, end: 0.63 }],
                messageC_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
                pinB_scaleY: [0.5, 1, { start: 0.5, end: 0.55 }],
                pinC_scaleY: [0.5, 1, { start: 0.72, end: 0.77 }],
                pinB_opacity_in: [0, 1, { start: 0.5, end: 0.55 }],
                pinC_opacity_in: [0, 1, { start: 0.72, end: 0.77 }],
                pinB_opacity_out: [1, 0, { start: 0.58, end: 0.63 }],
                pinC_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
            },
        },
        {
            // 3
            type: "sticky",
            heightNum: 5,
            scrollHeight: 0,
            obj: {
                container: document.querySelector("#scrollSec3"),
                canvasCaption: document.querySelector(".canvas-caption"),
                canvas: document.querySelector(".image-blend-canvas"),
                context: document
                    .querySelector(".image-blend-canvas")
                    .getContext("2d"),
                imagesPath: ["./img/partners.png", "./img/lang.png"],
                images: [],
            },
            values: {
                rect1X: [0, 0, { start: 0, end: 0 }],
                rect2X: [0, 0, { start: 0, end: 0 }],
                blendHeight: [0, 0, { start: 0, end: 0 }],
                canvas_scale: [0, 0, { start: 0, end: 0 }],
                canvasCaption_opacity: [0, 1, { start: 0, end: 0 }],
                canvasCaption_translateY: [20, 0, { start: 0, end: 0 }],
                rectStartY: 0,
            },
        },
    ];

    function setCanvasImages() {
        let imgElem3;
        for (let i = 0; i < sceneInfo[3].obj.imagesPath.length; i++) {
            imgElem3 = new Image();
            imgElem3.src = sceneInfo[3].obj.imagesPath[i];
            sceneInfo[3].obj.images.push(imgElem3);
        }
    }

    function checkMenu() {
        if (yOffset > 44) {
            document.body.classList.add("local-nav-sticky");
        } else {
            document.body.classList.remove("local-nav-sticky");
        }
    }

    function setLayout() {
        // 각 스크롤 섹션의 높이 세팅
        for (let i = 0; i < sceneInfo.length; i++) {
            if (sceneInfo[i].type === "sticky") {
                sceneInfo[i].scrollHeight =
                    sceneInfo[i].heightNum * window.innerHeight;
            } else if (sceneInfo[i].type === "normal") {
                sceneInfo[i].scrollHeight =
                    sceneInfo[i].obj.content.offsetHeight +
                    window.innerHeight * 0.5;
            }
            sceneInfo[
                i
            ].obj.container.style.height = `${sceneInfo[i].scrollHeight}px`;
        }

        yOffset = window.pageYOffset;

        let totalScrollHeight = 0;
        for (let i = 0; i < sceneInfo.length; i++) {
            totalScrollHeight += sceneInfo[i].scrollHeight;
            if (totalScrollHeight >= yOffset) {
                currentScene = i;
                break;
            }
        }
        document.body.setAttribute("id", `showScene${currentScene}`);

        const heightRatio = window.innerHeight / 1080;
        // sceneInfo[0].obj.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
        // sceneInfo[2].obj.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
    }

    function calcValues(values, currentYOffset) {
        let rv;
        // 현재 씬(스크롤섹션)에서 스크롤된 범위를 비율로 구하기
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight;

        if (values.length === 3) {
            // start ~ end 사이에 애니메이션 실행
            const partScrollStart = values[2].start * scrollHeight;
            const partScrollEnd = values[2].end * scrollHeight;
            const partScrollHeight = partScrollEnd - partScrollStart;

            if (
                currentYOffset >= partScrollStart &&
                currentYOffset <= partScrollEnd
            ) {
                rv =
                    ((currentYOffset - partScrollStart) / partScrollHeight) *
                        (values[1] - values[0]) +
                    values[0];
            } else if (currentYOffset < partScrollStart) {
                rv = values[0];
            } else if (currentYOffset > partScrollEnd) {
                rv = values[1];
            }
        } else {
            rv = scrollRatio * (values[1] - values[0]) + values[0];
        }

        return rv;
    }

    function playAnimation() {
        const obj = sceneInfo[currentScene].obj;
        const values = sceneInfo[currentScene].values;
        const currentYOffset = yOffset - prevScrollHeight;
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight;

        switch (currentScene) {
            case 0:
                // console.log('0 play');
                // let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
                // obj.context.drawImage(obj.videoImages[sequence], 0, 0);

                if (scrollRatio <= 0.22) {
                    // in
                    obj.messageA.style.opacity = calcValues(
                        values.messageA_opacity_in,
                        currentYOffset
                    );
                    obj.messageA.style.transform = `translate3d(0, ${calcValues(
                        values.messageA_translateY_in,
                        currentYOffset
                    )}%, 0)`;
                } else {
                    // out
                    obj.messageA.style.opacity = calcValues(
                        values.messageA_opacity_out,
                        currentYOffset
                    );
                    obj.messageA.style.transform = `translate3d(0, ${calcValues(
                        values.messageA_translateY_out,
                        currentYOffset
                    )}%, 0)`;
                }

                if (scrollRatio <= 0.42) {
                    // in
                    obj.messageB.style.opacity = calcValues(
                        values.messageB_opacity_in,
                        currentYOffset
                    );
                    obj.messageB.style.transform = `translate3d(0, ${calcValues(
                        values.messageB_translateY_in,
                        currentYOffset
                    )}%, 0)`;
                } else {
                    // out
                    obj.messageB.style.opacity = calcValues(
                        values.messageB_opacity_out,
                        currentYOffset
                    );
                    obj.messageB.style.transform = `translate3d(0, ${calcValues(
                        values.messageB_translateY_out,
                        currentYOffset
                    )}%, 0)`;
                }

                if (scrollRatio <= 0.62) {
                    // in
                    obj.messageC.style.opacity = calcValues(
                        values.messageC_opacity_in,
                        currentYOffset
                    );
                    obj.messageC.style.transform = `translate3d(0, ${calcValues(
                        values.messageC_translateY_in,
                        currentYOffset
                    )}%, 0)`;
                } else {
                    // out
                    obj.messageC.style.opacity = calcValues(
                        values.messageC_opacity_out,
                        currentYOffset
                    );
                    obj.messageC.style.transform = `translate3d(0, ${calcValues(
                        values.messageC_translateY_out,
                        currentYOffset
                    )}%, 0)`;
                }

                if (scrollRatio <= 0.82) {
                    // in
                    obj.messageD.style.opacity = calcValues(
                        values.messageD_opacity_in,
                        currentYOffset
                    );
                    obj.messageD.style.transform = `translate3d(0, ${calcValues(
                        values.messageD_translateY_in,
                        currentYOffset
                    )}%, 0)`;
                } else {
                    // out
                    obj.messageD.style.opacity = calcValues(
                        values.messageD_opacity_out,
                        currentYOffset
                    );
                    obj.messageD.style.transform = `translate3d(0, ${calcValues(
                        values.messageD_translateY_out,
                        currentYOffset
                    )}%, 0)`;
                }

                break;

            case 2:
                // console.log('2 play');
                // let sequence2 = Math.round(calcValues(values.imageSequence, currentYOffset));
                // obj.context.drawImage(obj.videoImages[sequence2], 0, 0);

                if (scrollRatio <= 0.5) {
                    // in
                } else {
                    // out
                }

                if (scrollRatio <= 0.25) {
                    // in
                    obj.messageA.style.opacity = calcValues(
                        values.messageA_opacity_in,
                        currentYOffset
                    );
                    obj.messageA.style.transform = `translate3d(0, ${calcValues(
                        values.messageA_translateY_in,
                        currentYOffset
                    )}%, 0)`;
                } else {
                    // out
                    obj.messageA.style.opacity = calcValues(
                        values.messageA_opacity_out,
                        currentYOffset
                    );
                    obj.messageA.style.transform = `translate3d(0, ${calcValues(
                        values.messageA_translateY_out,
                        currentYOffset
                    )}%, 0)`;
                }

                if (scrollRatio <= 0.57) {
                    // in
                    obj.messageB.style.transform = `translate3d(0, ${calcValues(
                        values.messageB_translateY_in,
                        currentYOffset
                    )}%, 0)`;
                    obj.messageB.style.opacity = calcValues(
                        values.messageB_opacity_in,
                        currentYOffset
                    );
                    obj.pinB.style.transform = `scaleY(${calcValues(
                        values.pinB_scaleY,
                        currentYOffset
                    )})`;
                } else {
                    // out
                    obj.messageB.style.transform = `translate3d(0, ${calcValues(
                        values.messageB_translateY_out,
                        currentYOffset
                    )}%, 0)`;
                    obj.messageB.style.opacity = calcValues(
                        values.messageB_opacity_out,
                        currentYOffset
                    );
                    obj.pinB.style.transform = `scaleY(${calcValues(
                        values.pinB_scaleY,
                        currentYOffset
                    )})`;
                }

                if (scrollRatio <= 0.83) {
                    // in
                    obj.messageC.style.transform = `translate3d(0, ${calcValues(
                        values.messageC_translateY_in,
                        currentYOffset
                    )}%, 0)`;
                    obj.messageC.style.opacity = calcValues(
                        values.messageC_opacity_in,
                        currentYOffset
                    );
                    obj.pinC.style.transform = `scaleY(${calcValues(
                        values.pinC_scaleY,
                        currentYOffset
                    )})`;
                } else {
                    // out
                    obj.messageC.style.transform = `translate3d(0, ${calcValues(
                        values.messageC_translateY_out,
                        currentYOffset
                    )}%, 0)`;
                    obj.messageC.style.opacity = calcValues(
                        values.messageC_opacity_out,
                        currentYOffset
                    );
                    obj.pinC.style.transform = `scaleY(${calcValues(
                        values.pinC_scaleY,
                        currentYOffset
                    )})`;
                }

                // currentScene 3에서 쓰는 캔버스를 미리 그려주기 시작
                if (scrollRatio > 0.9) {
                    const obj = sceneInfo[3].obj;
                    const values = sceneInfo[3].values;
                    const widthRatio = window.innerWidth / obj.canvas.width;
                    const heightRatio = window.innerHeight / obj.canvas.height;
                    let canvasScaleRatio;

                    if (widthRatio <= heightRatio) {
                        // 캔버스보다 브라우저 창이 홀쭉한 경우
                        canvasScaleRatio = heightRatio;
                    } else {
                        // 캔버스보다 브라우저 창이 납작한 경우
                        canvasScaleRatio = widthRatio;
                    }

                    obj.canvas.style.transform = `scale(${canvasScaleRatio})`;
                    obj.context.fillStyle = "white";
                    obj.context.drawImage(obj.images[0], 0, 0);

                    // 캔버스 사이즈에 맞춰 가정한 innerWidth와 innerHeight
                    const recalculatedInnerWidth =
                        document.body.offsetWidth / canvasScaleRatio;
                    const recalculatedInnerHeight =
                        window.innerHeight / canvasScaleRatio;

                    const whiteRectWidth = recalculatedInnerWidth * 0.15;
                    values.rect1X[0] =
                        (obj.canvas.width - recalculatedInnerWidth) / 2;
                    values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
                    values.rect2X[0] =
                        values.rect1X[0] +
                        recalculatedInnerWidth -
                        whiteRectWidth;
                    values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

                    // 좌우 흰색 박스 그리기
                    obj.context.fillRect(
                        parseInt(values.rect1X[0]),
                        0,
                        parseInt(whiteRectWidth),
                        obj.canvas.height
                    );
                    obj.context.fillRect(
                        parseInt(values.rect2X[0]),
                        0,
                        parseInt(whiteRectWidth),
                        obj.canvas.height
                    );
                }

                break;

            case 3:
                // console.log('3 play');
                let step = 0;
                // 가로/세로 모두 꽉 차게 하기 위해 여기서 세팅(계산 필요)
                const widthRatio = window.innerWidth / obj.canvas.width;
                const heightRatio = window.innerHeight / obj.canvas.height;
                let canvasScaleRatio;

                if (widthRatio <= heightRatio) {
                    // 캔버스보다 브라우저 창이 홀쭉한 경우
                    canvasScaleRatio = heightRatio;
                } else {
                    // 캔버스보다 브라우저 창이 납작한 경우
                    canvasScaleRatio = widthRatio;
                }

                obj.canvas.style.transform = `scale(${canvasScaleRatio})`;
                obj.context.fillStyle = "white";
                obj.context.drawImage(obj.images[0], 0, 0);

                // 캔버스 사이즈에 맞춰 가정한 innerWidth와 innerHeight
                const recalculatedInnerWidth =
                    document.body.offsetWidth / canvasScaleRatio;
                const recalculatedInnerHeight =
                    window.innerHeight / canvasScaleRatio;

                if (!values.rectStartY) {
                    // values.rectStartY = obj.canvas.getBoundingClientRect().top;
                    values.rectStartY =
                        obj.canvas.offsetTop +
                        (obj.canvas.height -
                            obj.canvas.height * canvasScaleRatio) /
                            2;
                    values.rect1X[2].start =
                        window.innerHeight / 2 / scrollHeight;
                    values.rect2X[2].start =
                        window.innerHeight / 2 / scrollHeight;
                    values.rect1X[2].end = values.rectStartY / scrollHeight;
                    values.rect2X[2].end = values.rectStartY / scrollHeight;
                }

                const whiteRectWidth = recalculatedInnerWidth * 0.15;
                values.rect1X[0] =
                    (obj.canvas.width - recalculatedInnerWidth) / 2;
                values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
                values.rect2X[0] =
                    values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth;
                values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

                // 좌우 흰색 박스 그리기
                obj.context.fillRect(
                    parseInt(calcValues(values.rect1X, currentYOffset)),
                    0,
                    parseInt(whiteRectWidth),
                    obj.canvas.height
                );
                obj.context.fillRect(
                    parseInt(calcValues(values.rect2X, currentYOffset)),
                    0,
                    parseInt(whiteRectWidth),
                    obj.canvas.height
                );

                console.log(scrollRatio, values.rect1X[2].end);
                if (scrollRatio < values.rect1X[2].end + 0.1) {
                    step = 1;
                    // console.log('캔버스 닿기 전');
                    obj.canvas.classList.remove("sticky");
                } else {
                    step = 2;
                    // console.log('캔버스 닿은 후');
                    // 이미지 블렌드
                    // values.blendHeight: [ 0, 0, { start: 0, end: 0 } ]
                    values.blendHeight[0] = 0;
                    values.blendHeight[1] = obj.canvas.height;
                    values.blendHeight[2].start = values.rect1X[2].end;
                    values.blendHeight[2].end =
                        values.blendHeight[2].start + 0.3;
                    const blendHeight = calcValues(
                        values.blendHeight,
                        currentYOffset
                    );

                    obj.context.drawImage(
                        obj.images[1],
                        0,
                        obj.canvas.height - blendHeight,
                        obj.canvas.width,
                        blendHeight,
                        0,
                        obj.canvas.height - blendHeight,
                        obj.canvas.width,
                        blendHeight
                    );

                    obj.canvas.classList.add("sticky");
                    obj.canvas.style.top = `${
                        -(
                            obj.canvas.height -
                            obj.canvas.height * canvasScaleRatio
                        ) / 2
                    }px`;

                    if (scrollRatio > values.blendHeight[2].end) {
                        values.canvas_scale[0] = canvasScaleRatio;
                        values.canvas_scale[1] =
                            document.body.offsetWidth /
                            (1.5 * obj.canvas.width);
                        values.canvas_scale[2].start =
                            values.blendHeight[2].end;
                        values.canvas_scale[2].end =
                            values.canvas_scale[2].start + 0.1;

                        obj.canvas.style.transform = `scale(${calcValues(
                            values.canvas_scale,
                            currentYOffset
                        )})`;
                        obj.canvas.style.marginTop = 0;
                    }

                    if (
                        scrollRatio > values.canvas_scale[2].end &&
                        values.canvas_scale[2].end > 0
                    ) {
                        obj.canvas.classList.remove("sticky");
                        obj.canvas.style.marginTop = `${scrollHeight * 0.3}px`;

                        values.canvasCaption_opacity[2].start =
                            values.canvas_scale[2].end;
                        values.canvasCaption_opacity[2].end =
                            values.canvasCaption_opacity[2].start + 0.1;
                        values.canvasCaption_translateY[2].start =
                            values.canvasCaption_opacity[2].start;
                        values.canvasCaption_translateY[2].end =
                            values.canvasCaption_opacity[2].end;
                        obj.canvasCaption.style.opacity = calcValues(
                            values.canvasCaption_opacity,
                            currentYOffset
                        );
                        obj.canvasCaption.style.transform = `translate3d(0, ${calcValues(
                            values.canvasCaption_translateY,
                            currentYOffset
                        )}%, 0)`;
                    } else {
                        obj.canvasCaption.style.opacity =
                            values.canvasCaption_opacity[0];
                    }
                }

                break;
        }
    }

    function scrollLoop() {
        enterNewScene = false;
        prevScrollHeight = 0;

        for (let i = 0; i < currentScene; i++) {
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }

        if (
            delayedYOffset <
            prevScrollHeight + sceneInfo[currentScene].scrollHeight
        ) {
            document.body.classList.remove("scroll-effect-end");
        }

        if (
            delayedYOffset >
            prevScrollHeight + sceneInfo[currentScene].scrollHeight
        ) {
            enterNewScene = true;
            if (currentScene === sceneInfo.length - 1) {
                document.body.classList.add("scroll-effect-end");
            }
            if (currentScene < sceneInfo.length - 1) {
                currentScene++;
            }
            document.body.setAttribute("id", `showScene${currentScene}`);
        }

        if (delayedYOffset < prevScrollHeight) {
            enterNewScene = true;
            // 브라우저 바운스 효과로 인해 마이너스가 되는 것을 방지(모바일)
            if (currentScene === 0) return;
            currentScene--;
            document.body.setAttribute("id", `showScene${currentScene}`);
        }

        if (enterNewScene) return;

        playAnimation();
    }

    function loop() {
        delayedYOffset = delayedYOffset + (yOffset - delayedYOffset) * acc;

        if (!enterNewScene) {
            if (currentScene === 0 || currentScene === 2) {
                const currentYOffset = delayedYOffset - prevScrollHeight;
                const obj = sceneInfo[currentScene].obj;
                const values = sceneInfo[currentScene].values;
            }
        }

        // 일부 기기에서 페이지 끝으로 고속 이동하면 body id가 제대로 인식 안되는 경우를 해결
        // 페이지 맨 위로 갈 경우: scrollLoop와 첫 scene의 기본 캔버스 그리기 수행
        if (delayedYOffset < 1) {
            scrollLoop();
        }
        // 페이지 맨 아래로 갈 경우: 마지막 섹션은 스크롤 계산으로 위치 및 크기를 결정해야할 요소들이 많아서 1픽셀을 움직여주는 것으로 해결
        if (
            document.body.offsetHeight - window.innerHeight - delayedYOffset <
            1
        ) {
            let tempYOffset = yOffset;
            scrollTo(0, tempYOffset - 1);
        }

        rafId = requestAnimationFrame(loop);

        if (Math.abs(yOffset - delayedYOffset) < 1) {
            cancelAnimationFrame(rafId);
            rafState = false;
        }
    }

    window.addEventListener("load", () => {
        setLayout(); // 중간에 새로고침 시, 콘텐츠 양에 따라 높이 계산에 오차가 발생하는 경우를 방지하기 위해 before-load 클래스 제거 전에도 확실하게 높이를 세팅하도록 한번 더 실행
        document.body.classList.remove("before-load");
        setLayout();

        // 중간에서 새로고침 했을 경우 자동 스크롤로 제대로 그려주기
        let tempYOffset = yOffset;
        let tempScrollCount = 0;
        if (tempYOffset > 0) {
            let siId = setInterval(() => {
                scrollTo(0, tempYOffset);
                tempYOffset += 5;

                if (tempScrollCount > 20) {
                    clearInterval(siId);
                }
                tempScrollCount++;
            }, 20);
        }

        window.addEventListener("scroll", () => {
            yOffset = window.pageYOffset;
            scrollLoop();
            checkMenu();

            if (!rafState) {
                rafId = requestAnimationFrame(loop);
                rafState = true;
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 900) {
                window.location.reload();
            }
        });

        window.addEventListener("orientationchange", () => {
            scrollTo(0, 0);
            setTimeout(() => {
                window.location.reload();
            }, 500);
        });
    });

    setCanvasImages();
})();
