// import logo from './logo.svg';
import './App.css';
import { Button } from 'primereact/button';
import React, { useState,useEffect } from "react";
import { withAuthenticator, View,AmplifyS3Image } from "@aws-amplify/ui-react";
import { Tree } from 'primereact/tree';
import "@aws-amplify/ui-react/styles.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";  
import "primeflex/primeflex.css"
import { Card } from 'primereact/card';
import { TabView, TabPanel } from 'primereact/tabview';


import { Storage } from "aws-amplify";

function Popup({ message, onClose }) {
  return (
    <div className="popup">
      <p>{message}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

function App({ signOut, user }  ) {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const [fileData, setFileData] = useState();
  const [image, setImage] = useState({url:""});
  const [fileStatus, setFileStatus] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [root, setRoot] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showUploadMessage, setShowUploadMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
<<<<<<< HEAD
  const [showPopup, setShowPopup] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  
=======

  var err = "";
>>>>>>> 2f6c56ef7af0868850704648dc15d39cd67a4d92

  const uploadFile = async () => {
    console.log(user);
    try {
<<<<<<< HEAD
      if (!fileData) {
        setErrorMessage("Please select a file before uploading.");
        setTimeout(() => setErrorMessage(""), 5000);
        return;
      }
  
      if (!fileData.type || fileData.type !== "text/csv") {
        setErrorMessage("Invalid file format. Please upload a CSV file.");
        setTimeout(() => setErrorMessage(""), 10000);
        return;
      }
      
=======

      if (fileData.type !== "text/csv") {
        err = "Invalid file format. Please upload a CSV file."
        setErrorMessage(err);
        throw new Error(err);
      }

>>>>>>> 2f6c56ef7af0868850704648dc15d39cd67a4d92
      const fileName = `${user.username}-${Math.floor(Date.now() / 1000)}#${user.attributes.email}.csv`;
      const result = await Storage.put(fileName, fileData, {
        contentType: fileData.type,
      });
      // Show the success message
      setShowSuccessMessage(true); 
      // Hide the message after 3 seconds
      setTimeout(() => setShowSuccessMessage(false), 3000); 
  
      setFileStatus(true);
      console.log("File uploaded successfully:", result);
    } catch (error) {
      console.error("Error:", err);
    } finally {
<<<<<<< HEAD
      if (fileData && fileData.type === "text/csv") {
=======
      if (err === ""){
>>>>>>> 2f6c56ef7af0868850704648dc15d39cd67a4d92
        setUploading(true);
        setShowUploadMessage(true); // Show the "Please wait" message
        setUploading(false);
        setTimeout(() => setShowUploadMessage(false), 10000); // Hide the "Please wait" message after 5 seconds
      }
  }
  };
  
  
  function processStorageList(response) {
    const filesystem = {};
    // https://stackoverflow.com/questions/44759750/how-can-i-create-a-nested-object-representation-of-a-folder-structure
    const add = (source, target, item) => {
      const elements = source.split('/');
      const element = elements.shift();
      if (!element) return; // blank

      target[element] = target[element] || { __data: item }; // element;
      if (elements.length) {
        target[element] =
          typeof target[element] === 'object' ? target[element] : {};
        add(elements.join('/'), target[element], item);
      }
    };
    response.results.forEach((item) => add(item.key, filesystem, item));
    return filesystem;
  }

  function transformObject(obj, targetFolders) {
    const result = [];
    for (const key in obj) {
      const value = obj[key];
      if (key === "__data" || targetFolders.includes(key)) {
        // Skip the target folder and its children
        continue;
      }
      if (typeof value === "object" && Object.keys(value).filter(i => i !== "__data").length) {
        // Parse the key as an integer (assuming it's a timestamp in seconds)
        const timestamp = parseInt(key, 10); 
        // Convert the timestamp to a readable date or use the original key if it's not a timestamp
        const label = isNaN(timestamp) ? key : new Date(timestamp * 1000).toLocaleString(); 
        
        const children = [...transformObject(value, targetFolders)];
        result.push({
          ...value.__data,
          label: label,
          data: key,
          children: children.map(child => {
            if (child.data.endsWith(".png")) {
              // Remove the date and ".png" extension from the filename of the image
              const imageName = child.data.replace(/_\d{1,2}_\d{4}\.png$/, "").replace(".png", "");
              return { ...child, label: imageName };
            } else {
              return child;
            }
          }),
        });
      } else {
        result.push({ ...value.__data, data: key, label: key });
      }
    }
    return result;
  }
  
  
  useEffect(() => {
    const hasSeenPopup = localStorage.getItem("hasSeenPopup");

    if (!hasSeenPopup && user && user.username) {
      setIsNewUser(true);
      localStorage.setItem("hasSeenPopup", "true");
    }
  }, [user]);

  const closePopup = () => {
    setIsNewUser(false);
    localStorage.setItem("hasSeenPopup", "true");
  };
  

  async function listObjectsFromS3(folderName) {
    const s3Objects = await Storage.list("", {
      bucket: "output-sales-pred",
      customPrefix: {
        public: `${user.username}/${folderName}`
      },
      pageSize: 'ALL'
    });
    // Set the target folder name here (e.g., "plot")
    const targetFolder = ["features","best-hyper-param","predCSV"]; 
    const filteredChildren = transformObject(processStorageList(s3Objects), targetFolder);
    
    console.log(filteredChildren);
    setFileList(filteredChildren);
  };
  
    const handleSelect = async(event) => {
      const node = event.node
      if (node.key.endsWith(".png")) {
        try{
        console.log(node)
      
        const res= await Storage.get("",{bucket:"output-sales-pred",customPrefix: {public: `${user.username}/${node.key}`},download: true});
        console.log(res)

        const blob = await res.Body.blob()
        console.log(URL.createObjectURL(blob))
        setImage({...node,url:URL.createObjectURL(blob)})
        }
        catch (e)  {
console.error(e)
        }
      }
    }

  
  

  useEffect(() => {
    listObjectsFromS3("")
  }, []);


  return (
    <View className="App">
      
      <div>
      <h1>Hello {user.username}</h1>
      <Button onClick={signOut}>Sign out</Button>
      {isNewUser && (
        <Popup
          message="Welcome to our app! This is your first visit."
          onClose={closePopup}
        />
      )}
      </div>
      <TabView>
                <TabPanel header="Show images">
                <div className="card flex align-items-start justify-content-center flex-wrap">
            <Tree className="flex md-6 align-items-center justify-content-center  font-bold border-round m-2" value={fileList}  onNodeClick={handleSelect}/>
            <div className="flex align-items-center justify-content-center  font-bold border-round m-2">
            <Card title={image.label} header={ <img alt="please select png plot" src={image.url} />} >
    <p className="m-0">
          </p>
</Card>
            </div>
      
        </div>
                </TabPanel>
                <TabPanel header="Upload Csv Files">
                <div>
<<<<<<< HEAD
                <input type="file" onChange={(e) => e.target.files && setFileData(e.target.files[0])} />
=======
                <input type="file" onChange={(e) => setFileData(e.target.files[0])} />
>>>>>>> 2f6c56ef7af0868850704648dc15d39cd67a4d92
      </div>

      <div>
        <Button onClick={uploadFile}>Upload file</Button>
        <br />
        <br />
      </div>
      {errorMessage && <div style={{ color: 'red' }} className="error-message">{errorMessage}</div>}
      {showSuccessMessage && <div>File uploaded successfully</div>}
      {showUploadMessage && (
          <hr/>
          & 
          <div>The results will be ready in a few minutes. <b>Thank you for your patience!</b>.</div>
          & 
          <p>You will get an email in this concern in case you already subscribed to our notification server via the email you got after the registration</p>
          &
          <p>Otherwise, visit the website later to see the results.</p>
        )}

      
                </TabPanel>
<<<<<<< HEAD
=======
            </TabView>
>>>>>>> 2f6c56ef7af0868850704648dc15d39cd67a4d92
      
            </TabView>

      
      
    </View>
  );
}

export default withAuthenticator(App);
