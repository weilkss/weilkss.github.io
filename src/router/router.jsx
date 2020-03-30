import React, { Suspense } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Loading from 'xwb-loading';

const Home = React.lazy(() => import('../pages/home/index'));
const Detail = React.lazy(() => import('../pages/detail/index'));
const Edit = React.lazy(() => import('../pages/edit/index'));
const Personal = React.lazy(() => import('../pages/personal/index'));
const Hot = React.lazy(() => import('../pages/hot/index'));
const Label = React.lazy(() => import('../pages/label/index'));
const Tabs = React.lazy(() => import('../pages/tabs/index'));
const Type = React.lazy(() => import('../pages/type/index'));
const Record = React.lazy(() => import('../pages/record/index'));
const Atlas = React.lazy(() => import('../pages/atlas/index'));
const Video = React.lazy(() => import('../pages/video/index'));
const See = React.lazy(() => import('../pages/atlas/see'));
const Upload = React.lazy(() => import('../pages/upload/index'));
const UploadVideo = React.lazy(() => import('../pages/upload/video'));
const VideoPlay = React.lazy(() => import('../pages/video/video'));
const Search = React.lazy(() => import('../pages/search/index'));

const LoadDom = () => (
  <div className="loading-box">
    <Loading size="64" color="#000" />
  </div>
);

class RouterIndex extends React.Component {
  render() {
    return (
      <Router>
        <Suspense fallback={<LoadDom />}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/detail/:id" component={Detail} />
            <Route exact path="/edit" component={Edit} />
            <Route exact path="/personal" component={Personal} />
            <Route exact path="/hot" component={Hot} />
            <Route exact path="/label" component={Label} />
            <Route exact path="/tabs/:id" component={Tabs} />
            <Route exact path="/type" component={Type} />
            <Route exact path="/record" component={Record} />
            <Route exact path="/atlas" component={Atlas} />
            <Route exact path="/atlas/:id" component={See} />
            <Route exact path="/video" component={Video} />
            <Route exact path="/video/:id" component={VideoPlay} />
            <Route exact path="/upload" component={Upload} />
            <Route exact path="/upload-video" component={UploadVideo} />
            <Route exact path="/search" component={Search} />
          </Switch>
        </Suspense>
      </Router>
    );
  }
}

export default RouterIndex;
