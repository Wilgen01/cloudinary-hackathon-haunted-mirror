import { Component, EventEmitter, inject, Input, OnChanges, OnDestroy, Output, Signal, SimpleChanges } from '@angular/core';
import { TimerService } from '../../services/timer.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.scss'
})
export class TimerComponent implements OnChanges, OnDestroy{
  @Input({ required: true }) time: number = 0;
  @Output() timeEnd: EventEmitter<void> = new EventEmitter();
  private readonly timerService: TimerService = inject(TimerService);

  timer: Signal<string> = this.timerService.timer;

  constructor() {
    this.timerService.timeEnd$.pipe(takeUntilDestroyed()).subscribe(() => {
      this.timeEnd.emit();
    });
  }

  ngOnDestroy(): void {
    this.timerService.clearTimer();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    changes['time'].currentValue && this.timerService.startTimer(changes['time'].currentValue);
  }
}
