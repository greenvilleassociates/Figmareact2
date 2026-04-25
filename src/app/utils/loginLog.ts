/**
 * Login Log Utility
 * Sends usage logs to the API /api/log endpoint
 */

interface LogEntry {
  userid: number;
  description: string;
  timestamp?: string;
}

/**
 * Sends a login log entry to the API
 * @param userid - User ID
 * @param description - Description of the login event
 */
export async function sendLoginLog(userid: number, description: string): Promise<void> {
  try {
    const logEntry: LogEntry = {
      userid,
      description,
      timestamp: new Date().toISOString()
    };

    console.log('📝 Sending login log:', logEntry);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch('https://api242.onrender.com/api/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify(logEntry),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      console.log('✅ Login log sent successfully');
    } else {
      console.log('⚠️ Login log not sent (status ' + response.status + ')');
    }
  } catch (error) {
    // Silently fail - logging is not critical
    console.log('⚠️ Login log not sent (API unavailable)');
  }
}

/**
 * Sends a general usage log entry to the API
 * @param userid - User ID
 * @param description - Description of the action
 */
export async function sendUsageLog(userid: number, description: string): Promise<void> {
  try {
    const logEntry: LogEntry = {
      userid,
      description,
      timestamp: new Date().toISOString()
    };

    console.log('📝 Sending usage log:', logEntry);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch('https://api242.onrender.com/api/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify(logEntry),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      console.log('✅ Usage log sent successfully');
    } else {
      console.log('⚠️ Usage log not sent (status ' + response.status + ')');
    }
  } catch (error) {
    // Silently fail - logging is not critical
    console.log('⚠️ Usage log not sent (API unavailable)');
  }
}
