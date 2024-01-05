
const mongoose = require('mongoose');
import config from 'config'; 
 
async function connect() {
    const dbUri = config.get<string>("dbUri");
    
    try {
        await mongoose.connect(dbUri);
        console.log(`DB Connected at ${dbUri}`)
    } catch (error) {
      console.log(error);
      //console.error("Could not connect to DB");
      //process.exit(1);
    }
}
    
    
export default connect;