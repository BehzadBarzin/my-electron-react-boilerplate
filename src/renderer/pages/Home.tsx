import { Channels } from '../../main/ipc/Channels';

function Home() {
  const btnClick = () => {
    window.app.messenger.send(Channels.Main, 'Hello from front!');
  };

  window.app.messenger.listen(Channels.Main, (...args) => {
    console.log(args[0]);
  });

  return (
    <button type="button" onClick={btnClick}>
      Home
    </button>
  );
}

export default Home;
