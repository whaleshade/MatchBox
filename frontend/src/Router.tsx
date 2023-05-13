import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/pages/login/login-page/Login';
import Auth from './components/pages/login/auth-page/Auth';
import Channel from './components/pages/chat/channel-page/Channel';
import MyMsg from './components/pages/chat/mymsg-page/MyMsg';
import FriendList from './components/pages/friend/friendlist-page/FriendList';
import BannedList from './components/pages/friend/bannedlist-page/BannedList';
import GameShop from './components/pages/game/gameshop-page/GameShop';
import PlayGame from './components/pages/game/playgame-page/PlayGame';
import FriendProfile from './components/pages/profiles/friend-page/FriendProfile';
import MyProfile from './components/pages/profiles/my-page/MyProfile';
import ChatRoom from './components/pages/chat/chatroom-page/ChatRoomt';
import CheckLogin from './components/pages/login/login-page/CheckLogin';
import GameSocketProvider from './components/pages/game/playgame-page/game-socket/GameSocketProvider';
import GamePage from './components/pages/game/watchgame-page/GamePage';
import ReadyGamePage from './components/pages/game/ready-game-page/ReadyGamePage';
import NotFoundPage from './components/pages/NotFoundPage';

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/chat/channel"
          element={
            <CheckLogin>
              <Channel />
            </CheckLogin>
          }
        />
        <Route
          // :id - channelId
          path="/chat/channel/:id"
          element={
            <CheckLogin>
              <ChatRoom />
            </CheckLogin>
          }
        />
        <Route
          path="/chat/mymsg"
          element={
            <CheckLogin>
              <MyMsg />
            </CheckLogin>
          }
        />
        <Route
          path="/friend/list"
          element={
            <CheckLogin>
              <FriendList />
            </CheckLogin>
          }
        />
        <Route
          path="/friend/banned"
          element={
            <CheckLogin>
              <BannedList />
            </CheckLogin>
          }
        />
        <Route
          // :id - userId
          path="/game/record/:id/history"
          element={
            <CheckLogin>
              <GamePage title="Game Record" />
            </CheckLogin>
          }
        />
        <Route
          path="/game/shop/"
          element={
            <CheckLogin>
              <GameShop />
            </CheckLogin>
          }
        />
        <Route
          // :id - gameWatchId
          path="/game/:id/ready"
          element={
            <CheckLogin>
              <GameSocketProvider>
                <ReadyGamePage />
              </GameSocketProvider>
            </CheckLogin>
          }
        />
        <Route
          // :id - gameWatchId
          path="/game/:id/play"
          element={
            <CheckLogin>
              <GameSocketProvider>
                <PlayGame />
              </GameSocketProvider>
            </CheckLogin>
          }
        />
        <Route
          // :id - gameId
          path="/game/watch/:id"
          element={
            <CheckLogin>
              <GameSocketProvider>
                <GamePage title="Game Watch" />
              </GameSocketProvider>
            </CheckLogin>
          }
        />
        <Route
          // :id - userId
          path="/profile/friend/:id"
          element={
            <CheckLogin>
              <FriendProfile />
            </CheckLogin>
          }
        />
        <Route
          path="/profile/my"
          element={
            <CheckLogin>
              <GameSocketProvider>
                <MyProfile />
              </GameSocketProvider>
            </CheckLogin>
          }
        />
        <Route
          path="*"
          element={
            <CheckLogin>
              <NotFoundPage />
            </CheckLogin>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
