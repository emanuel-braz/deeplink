import { Dialogs } from './core/dialogs/dialogs';
import { commands, ExtensionContext } from 'vscode';
import { createNotificationStatusBarItem, createDeeplinkStatusBarItem } from './core/views/views';
import { LocalDataSource } from './core/data/local_data_source';
import { APP_LOCAL_CACHE_CLEARED } from './core/consts/strings';
import { ANDROID_DEEPLINK_EXT, IOS_DEEPLINK_EXT, LAST_PROMPT_EXT, CLEAR_CACHE_EXT, IOS_PUSH_NOTIFICATION_EXT, ANDROID_PUSH_NOTIFICATION_EXT, PUSH_NOTIFICATION_LAST_USED_EXT } from './core/consts/extensions';
import DeeplinkDelegate from './features/deep_link/deeplink_delegate';
import PushNotificationDelegate from './features/push_notification/push_notification_delegate';

export function deactivate() { }

export function activate(context: ExtensionContext) {

	const deeplinkDelegate = new DeeplinkDelegate();
	const pushNotificationDelegate = new PushNotificationDelegate();
	
	// Deeplink
	createDeeplinkStatusBarItem().show();
	context.subscriptions.push(commands.registerCommand(ANDROID_DEEPLINK_EXT, async () => deeplinkDelegate.runPlatformCommand(context, true)));
	context.subscriptions.push(commands.registerCommand(IOS_DEEPLINK_EXT, async () => deeplinkDelegate.runPlatformCommand(context, false)));
	context.subscriptions.push(commands.registerCommand(LAST_PROMPT_EXT, async () => deeplinkDelegate.runPlatformCommand(context, LocalDataSource.isAndroid(context), true)));
	context.subscriptions.push(commands.registerCommand(CLEAR_CACHE_EXT, async () => {
		LocalDataSource.clear(context);
		Dialogs.snackbar.info(APP_LOCAL_CACHE_CLEARED);
	}));

	// Push Notification
	createNotificationStatusBarItem().show();
	context.subscriptions.push(commands.registerCommand(IOS_PUSH_NOTIFICATION_EXT, async () => pushNotificationDelegate.pushNotification(context, false)));
	context.subscriptions.push(commands.registerCommand(ANDROID_PUSH_NOTIFICATION_EXT, async () => pushNotificationDelegate.pushNotification(context, true)));
	context.subscriptions.push(commands.registerCommand(PUSH_NOTIFICATION_LAST_USED_EXT, async () => pushNotificationDelegate.pushNotification(context, LocalDataSource.isAndroid(context), true)));
}