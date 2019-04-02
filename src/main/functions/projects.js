import nedb from 'nedb';
import path from 'path';
import fs from 'fs';
import { app } from 'electron';
/**
 * 本地读取项目数据
 */
export const readProjects = () => {}


/**
 * 
 */
export const writeProject = () => {
  console.log(__dirname);
  fs.mkdir(path.resolve(__dirname, '/constant'), err => {
    console.log(err)
  });
  fs.writeFileSync(path.resolve(__dirname, '/constant'), 'hello world!')
}

export const initProjectsDB = () => {
  console.log(app.getPath('userData'))
  const  db = new nedb({ filename: path.join(app.getPath('userData'), 'something.db'), autoload: true  });
  var doc = { hello: 'world'
               , n: 5
               , today: new Date()
               , nedbIsAwesome: true
               , notthere: null
               , notToBeSaved: undefined  // Will not be saved
               , fruits: [ 'apple', 'orange', 'pear' ]
               , infos: { name: 'nedb' }
               };

db.insert(doc, function (err, newDoc) {   // Callback is optional
  // newDoc is the newly inserted document, including its _id
  // newDoc has no key called notToBeSaved since its value was undefined
  console.log(err)
});

db.find({hello: 'world'}, (err, doc)=>{
  console.log(doc)
})
}
