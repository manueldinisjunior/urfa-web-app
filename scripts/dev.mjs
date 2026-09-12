import {spawn} from 'node:child_process';
import {initialize} from '../server/setup.mjs';
import {openDatabase} from '../server/db.mjs';
const db=await openDatabase();await initialize(db,{seed:true});await db.close();
const children=[spawn(process.execPath,['--env-file-if-exists=.env','server/index.mjs'],{stdio:'inherit'}),spawn(process.execPath,['node_modules/vite/bin/vite.js',...process.argv.slice(2)],{stdio:'inherit'})];
const stop=()=>children.forEach(child=>child.kill('SIGTERM'));
process.on('SIGINT',stop);process.on('SIGTERM',stop);
for(const child of children)child.on('exit',code=>{stop();process.exitCode=code||0;});
