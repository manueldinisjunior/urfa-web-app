import {expect,test} from 'vitest';
import {pickupTimes} from './pickupTimes';
test('Berlin time excludes elapsed minutes and past dates',()=>{const now=new Date('2026-09-13T11:32:00Z');expect(pickupTimes('2026-09-13',now)[0]).toBe('13:35');expect(pickupTimes('2026-09-12',now)).toEqual([]);expect(pickupTimes('2026-09-14',now)[0]).toBe('00:00');});
test('no remaining slots at the end of today',()=>expect(pickupTimes('2026-09-13',new Date('2026-09-13T21:59:00Z'))).toEqual([]));
