import { Injectable, signal, WritableSignal } from '@angular/core';
import { interval, Subject, Subscription, take, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private readonly timeEnd: Subject<void> = new Subject();
  timer: WritableSignal<string> = signal<string>('00:30:00');
  timeEnd$ = this.timeEnd.asObservable();
  timerIntervalSubscription: Subscription;


  startTimer(ms: number) {
    this.setTimer(ms);
    this.timerIntervalSubscription = interval(1000).pipe(
      take(Math.ceil(ms / 1000))
    ).subscribe({
      next: (sec) => this.setTimer(ms - (sec * 1000)),
      complete: () => this.endTimer()
    })
  }

  private setTimer(ms: number) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);

    const hoursStr = (hours < 10) ? "0" + hours : hours;
    const minutesStr = (minutes < 10) ? "0" + minutes : minutes;
    const secondsStr = (seconds < 10) ? "0" + seconds : seconds;

    this.timer.set(`${hoursStr}:${minutesStr}:${secondsStr}`);
  }

  private endTimer() {
    timer(1000).subscribe(() => {
      this.timer.set('00:00:00');
      this.timeEnd.next();
    });
  }

  clearTimer() {
    this.timerIntervalSubscription.unsubscribe();
  }

}
