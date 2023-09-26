import {HashRouter, Routes, Route} from 'react-router-dom';
import ProfilePage from './pages/ProfilePage';
import CreateUserPage from './pages/CreateUserPage';
import LoginPage from './pages/LoginPage';
import PostPage from './pages/PostPage';
import SearchPage from './pages/SearchPage';
import SinglePostView from './pages/SinglePostView';
import PageLayOut from './components/PageLayOut';


function App() {
  return (
    <HashRouter>
      <Routes>
        <Route  path='/' element={<LoginPage/>} />
        <Route  path='/create-user' element={< CreateUserPage />} />
        <Route element={<PageLayOut />}>
          <Route  path='profile/:username' element={< ProfilePage />} />
          <Route  path='post/:username' element={<PostPage />} />
          <Route  path='post/:username/:id' element={<SinglePostView />} />
        </Route>
        <Route  path='search-profile' element={<SearchPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
