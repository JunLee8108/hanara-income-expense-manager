const { app, BrowserWindow, ipcMain, dialog, Menu } = require("electron");
const fs = require("fs");
const path = require("path");
const isDev = require("electron-is-dev");
const XLSX = require("xlsx");

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  win.maximize();

  win.on("close", (e) => {
    const choice = dialog.showMessageBoxSync(win, {
      type: "question",
      buttons: ["Yes", "No"],
      title: "Confirm",
      message:
        "Data will be lost without saving. Are you sure you want to exit? (저장하지 않고 종료시 데이터가 사라질 수 있습니다.)",
    });
    if (choice === 1) {
      e.preventDefault();
    } else {
      win.destroy();
    }
  });

  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "/build/index.html")}`
  );

  const isMac = process.platform === "darwin";

  const template = [
    // App Menu (MacOS)
    ...(isMac
      ? [
          {
            label: app.getName(),
            submenu: [
              { role: "about" },
              { type: "separator" },
              { role: "services" },
              { type: "separator" },
              { role: "hide" },
              { role: "hideOthers" },
              { role: "unhide" },
              { type: "separator" },
              { role: "quit" },
            ],
          },
        ]
      : []),
    // File Menu
    {
      label: "File",
      submenu: [
        {
          label: "Save Data",
          accelerator: isMac ? "Command+S" : "Ctrl+S",
          click() {
            win.webContents.send("trigger-save");
          },
        },
        {
          label: "Load Data",
          accelerator: isMac ? "Command+L" : "Ctrl+L",
          click() {
            BrowserWindow.getFocusedWindow().webContents.send("trigger-load");
          },
        },
        // Other standard file menu items can be added here
        { type: "separator" },
        isMac ? { role: "close" } : { role: "quit" },
      ],
    },
    {
      label: "Search",
      submenu: [
        {
          label: "Find",
          accelerator: "CmdOrCtrl+F",
          click: () => {
            // Send an IPC message to renderer to open a 'Find' dialog or feature
            win.webContents.send("trigger-find");
          },
        },
      ],
    },
    // Edit Menu
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        ...(isMac
          ? [
              { role: "pasteAndMatchStyle" },
              { role: "delete" },
              { role: "selectAll" },
              { type: "separator" },
              {
                label: "Speech",
                submenu: [{ role: "startSpeaking" }, { role: "stopSpeaking" }],
              },
            ]
          : [{ role: "delete" }, { type: "separator" }, { role: "selectAll" }]),
      ],
    },
    // View Menu
    {
      label: "View",
      submenu: [
        // TODO
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
    // Window Menu (MacOS has specific window roles)
    ...(isMac
      ? [
          {
            label: "Window",
            submenu: [
              { role: "minimize" },
              { role: "zoom" },
              { type: "separator" },
              { role: "front" },
              { type: "separator" },
              { role: "window" },
            ],
          },
        ]
      : [
          {
            label: "Window",
            submenu: [{ role: "minimize" }, { role: "close" }],
          },
        ]),
    // Help Menu
    {
      role: "help",
      submenu: [
        {
          label: "Learn More",
          click: async () => {
            const { shell } = require("electron");
            await shell.openExternal("https://electronjs.org");
          },
        },
        // Other help menu items can be added here
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

ipcMain.on("save-data", (event, { expenseData, URLIncomeData }) => {
  dialog
    .showSaveDialog({
      title: "Save Data",
      defaultPath: app.getPath("documents"),
      filters: [{ name: "JSON Files", extensions: ["json"] }],
    })
    .then((file) => {
      if (!file.canceled && file.filePath) {
        const combinedData = { expenseData, URLIncomeData };
        fs.writeFileSync(file.filePath, JSON.stringify(combinedData, null, 2));
        dialog.showMessageBox({
          type: "info",
          title: "Data Saved",
          message: "The data has been successfully saved. (저장 완료)",
        });
      }
    })
    .catch((err) => {
      console.error("Save File Error:", err);
      dialog.showErrorBox("Error", "Failed to save data.");
    });
});

// Handle load data request
ipcMain.on("load-data", (event) => {
  dialog
    .showOpenDialog({
      title: "Load Data",
      defaultPath: app.getPath("documents"),
      filters: [{ name: "JSON Files", extensions: ["json"] }],
      properties: ["openFile"],
    })
    .then((file) => {
      if (!file.canceled && file.filePaths.length > 0) {
        const data = fs.readFileSync(file.filePaths[0], "utf8");
        event.sender.send("loaded-data", JSON.parse(data));

        dialog.showMessageBox({
          type: "info",
          title: "Data Loaded",
          message:
            "The data has been successfully loaded. (성공적으로 로드하였습니다.)",
        });
      }
    })
    .catch((err) => {
      console.error("Load File Error:", err);
      dialog.showErrorBox("Error", "Failed to load data.");
    });
});

ipcMain.on("show-error-dialog", (event, message) => {
  dialog.showErrorBox("Error", message);
});

ipcMain.on("show-warning-dialog", (event, message) => {
  dialog.showErrorBox("warning", message);
});

ipcMain.on("show-info-dialog", (event, message) => {
  dialog.showMessageBox({
    type: "info",
    title: "Remove Successful",
    message: message,
  });
});

ipcMain.on("export-data-to-excel", (event, combinedData) => {
  dialog
    .showSaveDialog({
      title: "Export Data as Excel",
      defaultPath: app.getPath("documents"),
      filters: [{ name: "Excel Files", extensions: ["xlsx"] }],
    })
    .then((file) => {
      if (!file.canceled && file.filePath) {
        try {
          const workbook = XLSX.utils.book_new();

          // Check and add ExpenseData if available
          if (combinedData.expenseData) {
            const worksheet1 = XLSX.utils.json_to_sheet(
              combinedData.expenseData
            );
            XLSX.utils.book_append_sheet(workbook, worksheet1, "ExpenseData");
          }

          // Check and add URLIncomeData if available
          if (combinedData.URLIncomeData) {
            const worksheet2 = XLSX.utils.json_to_sheet(
              combinedData.URLIncomeData
            );
            XLSX.utils.book_append_sheet(workbook, worksheet2, "URLIncomeData");
          }

          // Write the workbook to the file
          XLSX.writeFile(workbook, file.filePath);

          // Show success message
          dialog.showMessageBox({
            type: "info",
            title: "Export Successful",
            message:
              "The data has been successfully exported to Excel. (엑셀로 내보내기 완료.)",
          });
        } catch (err) {
          console.error("Export Excel File Error:", err);
          dialog.showErrorBox("Error", "Failed to export data.");
        }
      }
    })
    .catch((err) => {
      console.error("Save File Dialog Error:", err);
    });
});

ipcMain.on("open-file-dialog-for-excel", async (event) => {
  const { filePaths } = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "Spreadsheets", extensions: ["xlsx", "xls"] }],
  });

  if (filePaths && filePaths.length > 0) {
    try {
      const file = filePaths[0];
      const fileContent = fs.readFileSync(file, "binary");
      const workbook = XLSX.read(fileContent, { type: "binary" });

      let expenseData = null,
        URLIncomeData = null;

      if (workbook.SheetNames.length > 0) {
        const worksheet1 = workbook.Sheets[workbook.SheetNames[0]];
        expenseData = XLSX.utils.sheet_to_json(worksheet1);
      }

      if (workbook.SheetNames.length > 1) {
        const worksheet2 = workbook.Sheets[workbook.SheetNames[1]];
        URLIncomeData = XLSX.utils.sheet_to_json(worksheet2);
      }

      // Send datasets to the renderer, even if they are null
      event.sender.send("excel-data", expenseData, URLIncomeData);

      dialog.showMessageBox({
        type: "info",
        title: "Success",
        message:
          "The data has been successfully loaded. (성공적으로 로드하였습니다.)",
      });
    } catch (error) {
      console.error("Error loading Excel file:", error);
      dialog.showMessageBox({
        type: "error",
        title: "Error",
        message: "Failed to load the data. Please check the Excel file format.",
      });
    }
  }
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
