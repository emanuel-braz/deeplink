import * as vscode from 'vscode';
import { APP_EXEC_NOT_FOUND } from '../consts/strings';
import { Dialogs } from '../dialogs/dialogs';
const fs = require('fs');
const path = require('path');

export class Platform {
    static checkIfExecutableIsAvailable(exec: string, showDefaultError: Boolean = true): Boolean {
        const isAvailable = require('hasbin').sync(exec);
        if (isAvailable != true) {
            if (showDefaultError)
                Dialogs.snackbar.error(APP_EXEC_NOT_FOUND.replace("{exec}", exec));
        }
        return isAvailable;
    }

    static getFiles(folder: string) : string[] {
        try {
            let currDir = Platform.getCurrentPath();
            const folderPath = path.join(currDir, folder);
            const files = fs.readdirSync(folderPath?.toString());
            return files;
        } catch(e){
            return [];
        }
    }

    static getCurrentPath() : string | undefined {
        return vscode.workspace.workspaceFolders?.[0].uri.fsPath.toString();
    }

    static getFileContent(folder: string, file: string) : string | undefined {
        try {
            let currDir = Platform.getCurrentPath();
            const folderPath = path.join(currDir, folder);

            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
            }
            const filePath = path.join(folderPath, file);
            if (!fs.existsSync(filePath)) {
                fs.writeFileSync(filePath, '');
            }

            const content = fs.readFileSync(filePath, 'utf8');
            return content;
        } catch(e){
            return undefined;
        }
    }

    static writeFileContent(folder: string, file: string, content: string) : void {
        let currDir = Platform.getCurrentPath();
        const folderPath = path.join(currDir, folder);
        const filePath = path.join(folderPath, file);
        fs.writeFileSync(filePath, content);
    }

    static copyToClipboard(content: string) {
        vscode.env.clipboard.writeText(content);
    }

}