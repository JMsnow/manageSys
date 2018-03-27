/*
 * Global configure
 */

import CONFIG from 'config/config'
import HTTP_CMD from 'config/http-command'
import ACTIONIDS_CMD from 'config/auth-alias'
import Debug from 'utils/debug'
import Utils from 'utils/utils'
import HttpRequest from 'utils/http-request'
import Helper from 'utils/helper'

window.CONFIG = window.CONFIG || CONFIG
window.HTTP_CMD = window.HTTP_CMD || HTTP_CMD
window.ACTIONIDS_CMD = window.ACTIONIDS_CMD || ACTIONIDS_CMD
window.debug = window.debug || new Debug()
window.utils = window.utils || new Utils()
window.helper = window.helper || new Helper()
window.request = window.request || new HttpRequest()
