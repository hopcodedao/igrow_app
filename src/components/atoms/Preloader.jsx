import { logo } from '../../assets';

function Preloader() {
  return (
    <div className="absolute left-0 top-0 flex h-screen w-screen items-center justify-center bg-light">
      <img alt="ATGTech" className="w-24 animate-fade-upwards opacity-0" src={logo} />
    </div>
  );
}

export default Preloader;
