const path= require('path');
const fs= require('fs');
const CreateRegex = (Exp) => new RegExp(Exp);
const ClearText = (text) => text.replace(/\s{2,}/g, '').replace('\n').replace('\r').trim();
const tar = require('tar');
const extractZip = require('extract-zip');
const CreateCondition = (IsResponseRegex,RegexTest) => [IsResponseRegex,CreateRegex(RegexTest)];
const GetFullPath = (Path) => path.resolve(Path);
const IsExits = (Path) => fs.existsSync(Path);
const CreateDir = (Path) => fs.mkdirSync(Path);
module.exports={
    CreateRegex,ClearText,CreateCondition,GetFullPath,IsExits,CreateDir,
    GetFiles:function(SpecPath){return fs.readdirSync(SpecPath,"utf-8");},
    UnZip:async function(File,OutputPath){
        return new Promise(async function(resolve, reject){extractZip(File,{dir:path.resolve(OutputPath)}).then(resolve);});
    },
    UnTar:async function(File,OutputPath){
        return new Promise(async function(resolve, reject) {
            tar.extract({cwd:path.resolve(OutputPath),strict:true,file:File}).then(resolve);
        });
    },
    Tar:async function(file,cwd,Path){
        return new Promise(async function(resolve, reject) {
            const _stream = fs.createWriteStream(file);
            tar.c({gzip: true, cwd}, [Path]).pipe(_stream);
            _stream.on("finish", function() {
                _stream.close(() => resolve(file));
            });
        });
    },
    UnArchive:async function(File,OutputPath){
        const FileFormat=(path.extname(File)).replace('.','');
        if(FileFormat=="zip"){await this.UnZip(File,OutputPath);}
        else if(FileFormat=="gz"){await this.UnTar(File,OutputPath);}
        return this.GetFiles(OutputPath);
    },
    UnArchiveAndDelete:async function(File,OutputPath){
        let Files=await this.UnArchive(File,OutputPath);
        fs.unlinkSync(File);
        Files.splice(Files.indexOf(path.basename(File)),1);
        return Files; 
    }
}