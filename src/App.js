import { useEffect, useState } from 'react';
import { Buffer } from "buffer";
import { create } from 'ipfs';

function App () {

  const [node, setNode] = useState(null);
  const [file, setFile] = useState(null);
  const [urlArr, setUrlArr] = useState([]);

  useEffect(() => {
    generateNode();
  },[])

  const generateNode = async () => {
    try {
      node?console.log(true):setNode(await create());
    } catch (error) {
      console.log(error.message)
    }
  }

  const retrieveFile = async (e) => {
    const data = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = async () => {
      setFile(Buffer(reader.result));
    }
    e.preventDefault();  
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await generateNode();
    try {
      const results = await node?.add(file);
      const url = `https://gateway.pinata.cloud/ipfs/${results.path}?__cf_chl_tk=9TtejZ61pl_JYhs2O7MLD37e7zfOOcsVQAyT34lavXc-1671073729-0-gaNycGzNBz0#x-ipfs-companion-no-redirect`;
      setUrlArr(prev => [...prev, url]);   
      console.log(urlArr)
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
  <>
    <div className="App">
      <form className="form" onSubmit={handleSubmit}>
        <input type="file" name="data" onChange={retrieveFile} />
        <button type="submit" className="btn">Upload file</button>
      </form>
      
    </div>
    <div className="display">
        { urlArr.map((el) => <img key={el} src={el} alt="nfts" />) }
    </div>
  </>
  );
}

export default App;
