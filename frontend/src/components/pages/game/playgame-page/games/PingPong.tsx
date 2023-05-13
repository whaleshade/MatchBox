import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSocket } from '../game-socket/GameSocketContext';

interface IUserState {
  isHost: boolean;
  isWatcher: boolean;
}

interface IPaddle {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

interface IBall {
  x: number;
  y: number;
  radius: number;
  color: string;
}

interface IBallControl {
  ball: IBall;
}

interface IPaddleControl {
  position: number;
}

interface IMapSize {
  width: number;
  height: number;
}

export default function PingPong() {
  const socket = useSocket();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isHost = useRef<boolean>(false);
  const isWatcher = useRef<boolean>(false);

  const { pathname } = window.location;
  const gameWatchId = pathname.split('/')[2];

  useEffect(() => {
    if (socket) {
      socket.emit(`ready`, {
        gameControl: 'connection..',
        gameWatchId,
      });

      if (socket) {
        socket.once('ishost', (data: IUserState) => {
          isHost.current = data.isHost;
          isWatcher.current = data.isWatcher;
        });
      }
    }

    return () => {
      socket?.off('ishost');
    };
  }, []);

  const ball = {
    x: 0,
    y: 0,
    radius: 6,
    color: 'white',
  };

  const paddleA = {
    x: 0,
    y: 30,
    width: 100,
    height: 4,
    color: 'yellow',
  };

  const paddleB = {
    x: 0,
    y: 0,
    width: 100,
    height: 4,
    color: 'skyblue',
  };

  function drawBall(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
  }

  function drawPaddle(ctx: CanvasRenderingContext2D, paddle: IPaddle) {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = paddle.color;
    ctx.fill();
    ctx.closePath();
  }

  function update() {
    if (socket) {
      socket.on('ballcontrol', (data: IBallControl) => {
        ball.x = data.ball.x;
        ball.y = data.ball.y;
        ball.color = data.ball.color;
        ball.radius = data.ball.radius;
      });
    }

    if (socket) {
      socket.on('controlB', (data: IPaddleControl) => {
        paddleB.x = data.position;
      });
    }
    if (socket) {
      socket.on('controlA', (data: IPaddleControl) => {
        paddleA.x = data.position;
      });
    }
  }

  function draw() {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');

      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        drawBall(ctx);
        drawPaddle(ctx, paddleB);
        drawPaddle(ctx, paddleA);
      }

      update();
    }
  }
  interface KeyState {
    [key: string]: boolean;
  }

  interface IntervalIds {
    [key: string]: number | null;
  }

  const keyState: KeyState = {
    ArrowLeft: false,
    ArrowRight: false,
    a: false,
    A: false,
    d: false,
    D: false,
  };
  const intervalIds: IntervalIds = {
    ArrowLeft: null,
    ArrowRight: null,
    a: null,
    A: null,
    d: null,
    D: null,
  };

  function keyDownHandler(e: KeyboardEvent) {
    const key = e.key.toLowerCase(); // Convert the key value to lowercase
    let controller = '';
    if (socket && !keyState[key]) {
      keyState[key] = true; // 키가 눌린 상태로 설정합니다.
      if (key === 'arrowleft' || key === 'arrowright') {
        if (isHost.current === true && isWatcher.current === false) {
          controller = 'gamecontrolB';
        }
        if (isHost.current === false && isWatcher.current === false) {
          controller = 'gamecontrolA';
        }
        if (intervalIds[key] !== null) {
          clearInterval(intervalIds[key]!);
        }
        intervalIds[key] = window.setInterval(() => {
          socket.emit(controller, {
            direction: key === 'arrowleft' ? -1 : 1,
          });
        }, 5);
      }
    }
  }

  function keyUpHandler(e: KeyboardEvent) {
    const key = e.key.toLowerCase(); // Convert the key value to lowercase
    let controller = '';
    if (socket && keyState[key]) {
      keyState[key] = false; // 키가 떼진 상태로 설정합니다.
      if (intervalIds[key] !== null) {
        clearInterval(intervalIds[key]!);
      }
      if (key === 'arrowleft' || key === 'arrowright') {
        if (isHost.current === true && isWatcher.current === false) {
          controller = 'gamecontrolB';
        }
        if (isHost.current === false && isWatcher.current === false) {
          controller = 'gamecontrolA';
        }
        socket.emit(controller, { direction: 0 });
      }
    }
  }

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      if (socket) {
        socket.once('mapSize', (data: IMapSize) => {
          canvas.width = data.width;
          canvas.height = data.height;
          ball.x = canvas.width / 2;
          ball.y = canvas.height / 2;

          paddleA.x = canvas.width / 2 - paddleA.width / 2;
          paddleA.y = 30;
          paddleB.x = canvas.width / 2 - paddleB.width / 2;
          paddleB.y = canvas.height - paddleB.height - 30;
        });
      }

      document.addEventListener('keydown', keyDownHandler);
      document.addEventListener('keyup', keyUpHandler);

      const gameLoop = () => {
        draw();
        requestAnimationFrame(gameLoop);
      };

      requestAnimationFrame(gameLoop);
    }

    return () => {
      document.removeEventListener('keydown', keyDownHandler);
      document.removeEventListener('keyup', keyUpHandler);
      socket?.off('mapSize');
    };
  }, []);

  return (
    <Game>
      <canvas ref={canvasRef} />
    </Game>
  );
}

const Game = styled.div`
  canvas {
    background: #000;
    display: block;
    width: 100%;
    height: 75vh;
  }
`;
